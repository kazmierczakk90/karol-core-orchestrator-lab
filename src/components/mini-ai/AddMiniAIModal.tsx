
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CreateMiniAIData } from '@/types/miniAI';

const miniAIFormSchema = z.object({
  name: z.string().nonempty("Name is required"),
  type: z.string().nonempty("Type is required"),
  description: z.string().optional(),
  category: z.string().optional(),
});

type MiniAIFormValues = z.infer<typeof miniAIFormSchema>;

interface AddMiniAIModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onMiniAIAdded: (miniAI: CreateMiniAIData, options?: { onSuccess?: () => void }) => void;
  isCreating: boolean;
}

export const AddMiniAIModal = ({ isOpen, onOpenChange, onMiniAIAdded, isCreating }: AddMiniAIModalProps) => {
  const form = useForm<MiniAIFormValues>({
    resolver: zodResolver(miniAIFormSchema),
    defaultValues: {
      name: '',
      type: 'standard-tool',
      description: '',
      category: '',
    },
  });

  const onSubmit = (values: MiniAIFormValues) => {
    onMiniAIAdded(values, {
        onSuccess: () => {
            form.reset();
            onOpenChange(false);
        }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Create New Mini AI Instance</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new Mini AI instance.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Content Summarizer" {...field} className="bg-slate-800 border-slate-600" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField name="type" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl><Input placeholder="e.g., standard-tool" {...field} className="bg-slate-800 border-slate-600" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField name="category" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl><Input placeholder="e.g., text-analysis" {...field} className="bg-slate-800 border-slate-600" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField name="description" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="Describe the instance's purpose" {...field} className="bg-slate-800 border-slate-600" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="border-slate-600">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isCreating} className="bg-gradient-primary hover:bg-gradient-secondary">
                {isCreating ? 'Creating...' : 'Create Instance'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
