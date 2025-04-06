import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: { label: string; type: string; name: string }[];
  onSubmit: (data: Record<string, string>) => void;
  dataList?: string[];
}

const GenericModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  fields,
  onSubmit,
  dataList,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogClose asChild>
            <Button
              variant="secondary"
              className="absolute top-2 right-2"
              onClick={onClose}
            ></Button>
          </DialogClose>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-500"
                value={formData[field.name] || ''}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <div className="flex justify-end">
            <Button type="submit" variant="default" className="bg-blue">
              Salvar
            </Button>
          </div>
        </form>

        {dataList && dataList.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Cadastrados</h3>
            <div className="overflow-x-auto max-h-40 overflow-y-auto border rounded-md">
              <table className="min-w-full text-sm text-left table-auto">
                <thead>
                  <tr>
                    {Object.keys(dataList[0]).map((key) => (
                      <th key={key} className="px-3 py-2 border-b font-medium">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataList.map((item, index) => (
                    <tr key={index}>
                      {Object.values(item).map((value, i) => (
                        <td key={i} className="px-3 py-2 border-b">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GenericModal;
