import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DEV_ROLES, SENIORITY_LEVELS, DEV_ROLE_LABELS, SENIORITY_LABELS } from '@/utils/enums';

export default function DevForm({ dev, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    role: '',
    seniority: '',
    lastWeek: '',
    thisWeek: '',
    nextWeek: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (dev) {
      setFormData({
        name: dev.name || '',
        color: dev.color || '',
        role: dev.role || '',
        seniority: dev.seniority || '',
        lastWeek: dev.lastWeek || '',
        thisWeek: dev.thisWeek || '',
        nextWeek: dev.nextWeek || ''
      });
    } else {
      setFormData({
        name: '',
        color: '#3B82F6',
        role: '',
        seniority: '',
        lastWeek: '',
        thisWeek: '',
        nextWeek: ''
      });
    }
    setError(null);
  }, [dev, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao salvar desenvolvedor');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {dev ? 'Editar Desenvolvedor' : 'Novo Desenvolvedor'}
          </DialogTitle>
          <DialogDescription>
            {dev
              ? 'Atualize as informações do desenvolvedor. Deixe os campos de semana vazios para sincronização automática.'
              : 'Adicione um novo desenvolvedor ao time.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ex: João Silva"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Função *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleChange('role', value)}
                required
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(DEV_ROLES).map(role => (
                    <SelectItem key={role} value={role}>
                      {DEV_ROLE_LABELS[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seniority">Senioridade *</Label>
              <Select
                value={formData.seniority}
                onValueChange={(value) => handleChange('seniority', value)}
                required
              >
                <SelectTrigger id="seniority">
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SENIORITY_LEVELS).map(level => (
                    <SelectItem key={level} value={level}>
                      {SENIORITY_LABELS[level]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Cor</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                placeholder="#3B82F6"
                className="flex-1"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-3">
              Atividades por semana (opcional - gerado automaticamente se vazio)
            </p>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="lastWeek">Semana Passada</Label>
                <Input
                  id="lastWeek"
                  value={formData.lastWeek}
                  onChange={(e) => handleChange('lastWeek', e.target.value)}
                  placeholder="Gerado automaticamente das timeline tasks"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thisWeek">Esta Semana</Label>
                <Input
                  id="thisWeek"
                  value={formData.thisWeek}
                  onChange={(e) => handleChange('thisWeek', e.target.value)}
                  placeholder="Gerado automaticamente das timeline tasks"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextWeek">Próxima Semana</Label>
                <Input
                  id="nextWeek"
                  value={formData.nextWeek}
                  onChange={(e) => handleChange('nextWeek', e.target.value)}
                  placeholder="Gerado automaticamente das timeline tasks"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : (dev ? 'Atualizar' : 'Criar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
