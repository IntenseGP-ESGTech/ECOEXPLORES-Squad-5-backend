import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  apiGetLearningPathById,
  apiCreateLearningPath,
  apiUpdateLearningPath,
} from '../api/learningPaths';
import { getAuthToken } from '../api/auth';
import './LearningPathForm.css';

export default function LearningPathForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    targetAudience: '',
    status: 'Rascunho',
    content: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getAuthToken()) {
      navigate('/login');
      return;
    }
    if (isEdit) {
      loadPath();
    }
  }, [navigate, id, isEdit]);

  const loadPath = async () => {
    try {
      setLoading(true);
      const data = await apiGetLearningPathById(id);
      setFormData({
        code: data.path.code || '',
        name: data.path.name || '',
        description: data.path.description || '',
        targetAudience: data.path.targetAudience || '',
        status: data.path.status || 'Rascunho',
        content: data.path.content || [],
      });
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit) {
        await apiUpdateLearningPath(id, formData);
      } else {
        await apiCreateLearningPath(formData);
      }
      navigate('/learning-paths');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return <div className="form-container">Carregando...</div>;
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <button className="btn-back-home" onClick={() => navigate('/home')}>
            ← Voltar para Home
          </button>
          <h1>{isEdit ? 'Editar Trilha' : 'Nova Trilha de Aprendizado'}</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="code">Código da Trilha *</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              placeholder="Ex: TRL-E01"
              disabled={isEdit}
            />
            <small>Identificador único da trilha</small>
          </div>

          <div className="form-group">
            <label htmlFor="name">Nome da Trilha *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ex: Aventura Sustentável I"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Explicação do tema, nível e objetivo geral da trilha"
            />
          </div>

          <div className="form-group">
            <label htmlFor="targetAudience">Público-Alvo</label>
            <select
              id="targetAudience"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
            >
              <option value="">Selecione...</option>
              <option value="Fundamental I">Fundamental I</option>
              <option value="Fundamental II">Fundamental II</option>
              <option value="Médio">Médio</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Rascunho">Rascunho</option>
              <option value="Publicada">Publicada</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/learning-paths')}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

