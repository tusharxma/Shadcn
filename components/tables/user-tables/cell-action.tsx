'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { EditModal } from '@/components/modal/edit-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Modal } from '@/components/ui/modal';
import { User } from '@/constants/data';
import useStore from '@/lib/store';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { title } from 'process';
import { useState } from 'react';

interface CellActionProps {
  data: User;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  // const [openEdit, setEditModel] = useState(false);
  const { openModel, setOpenModel } = useStore();
  const [userData, setUserData] = useState({});

  const router = useRouter();

  const handleData = () => {};

  const onConfirm = async () => {};

  return (
    <>
      <AlertModal
        data={userData as User}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => {
              setOpen(true);
              setOpenModel('Edit');
              setUserData(data);
            }}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setUserData({
                name: data.name,
                email: data.email,
                phone: data.phone,
                id: data.id
              });
              setOpen(true);
              setOpenModel('Delete');
            }}
          >
            <Trash className="mr-2 h-4 w-4" onClick={handleData} /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
