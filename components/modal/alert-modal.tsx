'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import useStore from '@/lib/store';
import { User } from '@/constants/data';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .regex(/^[a-zA-Z\s]+$/, {
      message: 'Name can only contain alphabetic characters'
    }),
  phone: z
    .number()
    .min(10, { message: 'Phone number must be at least 10 digits' })
});

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  data: User;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  data
}) => {
  const initialValues: User = {
    name: data.name,
    id: data.id,
    email: data.email,
    phone: data.phone
  };

  const [isMounted, setIsMounted] = useState(false);
  const { openModel } = useStore();
  const [userData, setUserData] = useState<User>(initialValues);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    setUserData(data);
  }, [data]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userData.name,
      phone: userData.phone
    }
  });

  const handleSubmit = (values: any) => {
    console.log('Form Values:', values);
    onConfirm();
  };

  if (!isMounted) {
    return null;
  }

  const handleDelete = async () => {
    await deleteDoc(doc(db, 'users', userData.id));
    router.refresh();
    toast({
      variant: 'default',
      title: 'User Deleted !!',
      description: 'User deleted successfully!!'
    });

    onClose();
  };

  const handleUpdate = async () => {
    const updatedData = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone
    };
    // console.log("🚀 ~ handleUpdate ~ data:",updatedData )
    try {
      const userDoc = doc(db, 'users', userData.id); // adjust the collection name if necessary
      await updateDoc(userDoc, updatedData);
      onClose();
      toast({
        variant: 'default',
        title: 'User Updated !!',
        description: 'User updated successfully!!'
      });
      router.refresh();
    } catch (error) {}
  };

  return (
    <Modal
      title={openModel === 'Delete' ? 'Are you sure?' : 'Update Information'}
      description={
        openModel === 'Delete'
          ? 'This action cannot be undone.'
          : 'You cannot update your email'
      }
      isOpen={isOpen}
      onClose={onClose}
    >
      {openModel === 'Delete' ? (
        <div></div>
      ) : (
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div>
            <input
              type="text"
              {...form.register('name')}
              className="rounded-lg px-3 py-2"
              placeholder="Name"
              value={userData.name}
              onChange={(e) => {
                setUserData({ ...userData, name: e.target.value });
              }}
            />
            {form.formState.errors.name && (
              <p className="text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
            <input
              type="text"
              className="mt-3 rounded-lg px-3 py-2"
              placeholder="Email"
              value={userData.email}
              disabled
            />
            <input
              type="number"
              {...form.register('phone')}
              className="mt-3 rounded-lg px-3 py-2"
              placeholder="Phone Number"
              value={userData.phone}
              onChange={(e) => {
                setUserData({ ...userData, phone: Number(e.target.value) });
              }}
            />
            {form.formState.errors.phone && (
              <p className="text-red-500">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>
        </form>
      )}
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={loading}
          variant="destructive"
          type="submit"
          onClick={openModel === 'Delete' ? handleDelete : handleUpdate}
        >
          {openModel === 'Delete' ? 'continue' : 'Update'}
        </Button>
      </div>
    </Modal>
  );
};
