import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGetLearningPaths, apiDeleteLearningPath } from '../api/learningPaths';
import { getAuthToken } from '../api/auth';
import './LearningPathsList.css';

export default function LearningPathsList() {
  const navigate = useNavigate();
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAudience, setFilterAudience] = useState('');

  useEffect(() => {
    if (!getAuthToken()) {
      navigate('/login');
      return;
    }
    loadPaths();
  }, [navigate, filterStatus, filterAudience]);

  const loadPaths = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (filterStatus) filters.status = filterStatus;
      if (filterAudience) filters.targetAudience = filterAudience;
      const data = await apiGetLearningPaths(filters);
      setPaths(data.paths || []);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar esta trilha?')) return;
    try {
      await apiDeleteLearningPath(id);
      await loadPaths();
    } catch (e) {
      alert('Erro ao deletar: ' + e.message);
    }
  };

  return (
    <div className="learning-paths-container">
      <div className="learning-paths-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate('/home')}>
            ← Voltar
          </button>
          <h1>Trilhas de Aprendizado</h1>
        </div>
        <button className="btn-create" onClick={() => navigate('/learning-paths/new')}>
          + Nova Trilha
        </button>
      </div>

      <div className="filters">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="">Todos os status</option>
          <option value="Rascunho">Rascunho</option>
          <option value="Publicada">Publicada</option>
        </select>

        <select
          value={filterAudience}
          onChange={(e) => setFilterAudience(e.target.value)}
          className="filter-select"
        >
          <option value="">Todos os públicos</option>
          <option value="Fundamental I">Fundamental I</option>
          <option value="Fundamental II">Fundamental II</option>
          <option value="Médio">Médio</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : paths.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma trilha encontrada.</p>
          <button className="btn-create" onClick={() => navigate('/learning-paths/new')}>
            Criar primeira trilha
          </button>
        </div>
      ) : (
        <div className="paths-grid">
          {paths.map((path) => (
            <div key={path.id} className="path-card">
              <div className="path-header">
                <span className="path-code">{path.code}</span>
                <span className={`path-status ${path.status.toLowerCase()}`}>
                  {path.status}
                </span>
              </div>
              <h3 className="path-name">{path.name}</h3>
              {path.description && (
                <p className="path-description">{path.description}</p>
              )}
              {path.targetAudience && (
                <div className="path-meta">
                  <span className="path-audience">Público: {path.targetAudience}</span>
                </div>
              )}
              <div className="path-actions">
                <button
                  className="btn-edit"
                  onClick={() => navigate(`/learning-paths/${path.id}/edit`)}
                >
                  Editar
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(path.id)}
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

