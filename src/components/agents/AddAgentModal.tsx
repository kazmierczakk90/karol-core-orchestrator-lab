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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateAgentData } from '@/types/agent';

const agentFormSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["core", "karol", "integration", "utility"]),
  description: z.string().min(1, "Description is required"),
  capabilities: z.string(),
  version: z.string().min(1, "Version is required"),
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

interface AddAgentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAgentAdded: (agent: CreateAgentData, options?: { onSuccess?: () => void }) => void;
  isCreating: boolean;
}

export const AddAgentModal = ({ isOpen, onOpenChange, onAgentAdded, isCreating }: AddAgentModalProps) => {
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      identifier: '',
      name: '',
      type: 'utility',
      description: '',
      capabilities: '',
      version: '1.0.0',
    },
  });

  const onSubmit = (values: AgentFormValues) => {
    const agentData: CreateAgentData = {
      identifier: values.identifier,
      name: values.name,
      type: values.type,
      description: values.description,
      version: values.version,
      capabilities: values.capabilities.split(',').map(s => s.trim()).filter(Boolean),
    };
    onAgentAdded(agentData, {
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
          <DialogTitle>Add New Agent</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new system agent.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField name="name" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Content Writer" {...field} className="bg-slate-800 border-slate-600" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField name="identifier" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identifier</FormLabel>
                    <FormControl><Input placeholder="e.g., @content-writer" {...field} className="bg-slate-800 border-slate-600" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField name="type" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-800 border-slate-600">
                        <SelectValue placeholder="Select an agent type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-800 text-white border-slate-600">
                      <SelectItem value="core">Core</SelectItem>
                      <SelectItem value="karol">Karol</SelectItem>
                      <SelectItem value="integration">Integration</SelectItem>
                      <SelectItem value="utility">Utility</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField name="description" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="Describe the agent's purpose" {...field} className="bg-slate-800 border-slate-600" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField name="capabilities" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Capabilities</FormLabel>
                  <FormControl><Input placeholder="e.g., writing, editing, research" {...field} className="bg-slate-800 border-slate-600" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField name="version" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Version</FormLabel>
                  <FormControl><Input placeholder="e.g., 1.0.0" {...field} className="bg-slate-800 border-slate-600" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="border-slate-600">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isCreating} className="bg-gradient-primary hover:bg-gradient-secondary">
                {isCreating ? 'Creating...' : 'Create Agent'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
