"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@/lib/api-client";
import { Plus } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const createFeedbackSchema = z.object({
    title: z.string().min(5, "O título deve ter pelo menos 5 caracteres").max(100, "O título é muito longo"),
    category: z.string().min(1, "Selecione uma categoria válida"),
    description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres").max(1000, "A descrição é muito longa"),
});

type CreateFeedbackFormValues = z.infer<typeof createFeedbackSchema>;

export function CreateFeedbackModal() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<CreateFeedbackFormValues>({
        resolver: zodResolver(createFeedbackSchema),
        defaultValues: {
            title: "",
            category: "",
            description: "",
        },
    });

    const onSubmit = async (data: CreateFeedbackFormValues) => {
        try {
            setIsLoading(true);

            await apiClient("/feedbacks", {
                method: "POST",
                body: JSON.stringify(data),
            });

            setOpen(false);
            form.reset();
            router.refresh();

        } catch (error) {
            form.setError("root", {
                message: error instanceof Error
                    ? error.message
                    : "Falha ao enviar o feedback. Tente novamente."
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Sugerir Ideia</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Novo Feedback</DialogTitle>
                    <DialogDescription>
                        Compartilhe ideias, reporte bugs ou solicite novas funcionalidades.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {form.formState.errors.root && (
                            <div className="text-sm font-medium text-destructive">
                                {form.formState.errors.root.message}
                            </div>
                        )}

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Modo escuro na visualização de relatórios"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoria</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isLoading}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione uma categoria" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Feature">Feature</SelectItem>
                                            <SelectItem value="UI">UI</SelectItem>
                                            <SelectItem value="UX">UX</SelectItem>
                                            <SelectItem value="Bug">Bug</SelectItem>
                                            <SelectItem value="Performance">Performance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Adicione detalhes sobre sua sugestão..."
                                            className="resize-none"
                                            rows={4}
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Enviando..." : "Enviar Feedback"}
                            </Button>
                        </div>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}