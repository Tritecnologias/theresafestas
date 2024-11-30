import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

export function StoreSettings() {
  const { settings, updateSettings, isLoading, error } = useStore();
  const [storeName, setStoreName] = useState(settings.storeName);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setStoreName(settings.storeName);
  }, [settings.storeName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSuccessMessage(null);

    try {
      await updateSettings({ storeName });
      setSaveError(null);
      setSuccessMessage('Configurações salvas com sucesso!');
      
      // Limpa a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setSaveError((error as Error).message);
      setSuccessMessage(null);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Configurações da Loja</h1>

      {error && <ErrorMessage message={error} />}
      {saveError && <ErrorMessage message={saveError} />}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div>
          <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
            Nome da Loja
          </label>
          <input
            id="storeName"
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving || storeName === settings.storeName}>
            {isSaving ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner />
                <span>Salvando...</span>
              </div>
            ) : (
              'Salvar Configurações'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}