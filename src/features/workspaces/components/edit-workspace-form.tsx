"use client";

import { useForm } from "react-hook-form";

import { z } from "zod";
import { useRef } from "react";
import { updateWorkspaceSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { DottedSeparator } from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Workspace } from "../types";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useConfirm } from "@/hooks/use-confirm";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

export const EditWorkspaceForm = ({
  onCancel,
  initialValues,
}: EditWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateWorkspace();

  const [DeleteDilog, confermDelete] = useConfirm(
    "Delete Workspace",
    "This action cannot be undone.",
    "destructive"
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event);
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };
  const handleDelete = async () => {
    const ok = await confermDelete();
    if (!ok) return;
    console.log("delete");
  };
  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };

    mutate(
      {
        form: finalValues,
        param: {
          workspaceId: initialValues.$id,
        },
      },
      {
        onSuccess: ({ data }) => {
          form.reset();
          // onCancel?.();
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDilog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-7">
          <Button
            size="sm"
            variant="secondary"
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValues.$id}`)
            }
          >
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator diraction="horizontal" />
          <CardContent className="p-7">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Workspace name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <div className="flex flex-col gap-y-2">
                        <div className="flex items-center gap-x-5">
                          {field.value ? (
                            <div className="size-[72px] relative rounded-md overflow-hidden">
                              <Image
                                src={
                                  field.value instanceof File
                                    ? URL.createObjectURL(field.value)
                                    : field.value
                                }
                                alt="Workspace logo"
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <Avatar className="size-[72px]">
                              <AvatarFallback>
                                <ImageIcon className="size-[36px] text-neutral-400" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className="flex flex-col">
                            <p className="text-sm">Workspace logo</p>
                            <p className="text-sm text-muted-foreground">
                              JPG, PNG, SVG or JPEG, max 1mb
                            </p>
                            <input
                              className="hidden"
                              type="file"
                              accept=".jpg, .jpeg, .png, .svg"
                              ref={inputRef}
                              onChange={handleImageChange}
                              disabled={isPending}
                            />
                            {field.value ? (
                              <Button
                                type="button"
                                variant="destructive"
                                disabled={isPending}
                                size="xs"
                                className="w-fit mt-2"
                                onClick={() => {
                                  field.onChange("");
                                  if (inputRef.current) {
                                    inputRef.current.value = "";
                                  }
                                }}
                              >
                                Remove image
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                variant="tertiary"
                                disabled={isPending}
                                size="xs"
                                className="w-fit mt-2"
                                onClick={() => inputRef.current?.click()}
                              >
                                Upload image
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>
                <DottedSeparator className="py-7" diraction="horizontal" />
                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    size="lg"
                    variant={"secondary"}
                    onClick={onCancel}
                    disabled={isPending}
                    className={cn(!onCancel && "invisible")}
                  >
                    Cancel
                  </Button>
                  <Button disabled={isPending} type="submit" size="lg">
                    Save changes
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </div>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting this workspace will permanently delete all of your data.
            </p>
            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant={"destructive"}
              disabled={isPending}
              type="button"
              onClick={handleDelete}
            >
              Delete workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
