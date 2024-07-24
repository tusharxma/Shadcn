'use client';
import * as z from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { collection, addDoc } from 'firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
// import FileUpload from "@/components/FileUpload";
import { useToast } from '../ui/use-toast';
import FileUpload from '../file-upload';
import { db } from '@/utils/firebase';

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Invalid name' })
    .max(50, { message: 'Name length should not be more than 50' }),
  email: z.string().email({ message: 'Email is not valid' }),
  // .max(50, { message: 'Only 50 characters' })
  // .min(1, { message: 'At least one image must be added.' }),
  phone: z
    .string()
    .min(10, { message: 'Must be a valid mobile number' })
    .refine(
      (value) => {
        const number = parseFloat(value);
        return !isNaN(number) && number.toString().length === 10;
      },
      {
        message: 'Must be a valid mobile number'
      }
    )
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: any | null;
  categories: any;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const title = 'Create User';
  const description = 'Add a new user';
  const toastMessage = initialData ? 'Product updated.' : 'Product created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData
    ? initialData
    : {
        name: '',
        email: '',
        phone: null
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const apiData = {
        name: data.name,
        email: data.email,
        phone: Number(data.phone)
      };
      setLoading(true);

      const docRef = await addDoc(collection(db, 'users'), apiData);
      console.log('product', docRef);

      router.refresh();
      router.push(`/dashboard/user`);
      toast({
        variant: 'default',
        title: 'Hurrah!!!',
        description: 'User created successfully!!'
      });
      router.refresh();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Please try again'
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      //   await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <>
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      /> */}
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          {/* <FormField
            control={form.control}
            name="imgUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <FileUpload
                    onChange={field.onChange}
                    value={field.value}
                    onRemove={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter your name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter your email..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={loading}
                      {...field}
                      placeholder="Enter your phone number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
