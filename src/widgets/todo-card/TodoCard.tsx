"use client";

import Link from "next/link";
import { Repeat, Paperclip, Calendar } from "lucide-react";
import { toast } from "sonner";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { TodoResponseDto } from "@/shared/api/types";
import { PRIORITY_CONFIG, REPEAT_LABELS } from "@/shared/lib/constants";
import { formatDeadline } from "@/shared/lib/format";
import { updateTodo } from "@/features/todos/api";

interface TodoCardProps {
  todo: TodoResponseDto;
  onToggle?: (todo: TodoResponseDto) => void;
}

export function TodoCard({ todo, onToggle }: TodoCardProps) {
  const priorityCfg = PRIORITY_CONFIG[todo.priority];
  const deadline = todo.deadline ? formatDeadline(todo.deadline) : null;

  async function handleToggle() {
    try {
      onToggle?.({ ...todo, done: !todo.done });
      await updateTodo(todo.id, { done: !todo.done });
    } catch {
      onToggle?.(todo);
      toast.error("Не удалось обновить задачу");
    }
  }

  return (
    <div className="group flex items-start gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50">
      <Checkbox
        checked={todo.done}
        onCheckedChange={handleToggle}
        className="mt-0.5"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/todos/${todo.id}`}
            className={`text-sm font-medium hover:underline ${
              todo.done
                ? "text-muted-foreground line-through"
                : "text-foreground"
            }`}
          >
            {todo.todoName}
          </Link>

          {todo.priority !== "NONE" && (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityCfg.color} ${priorityCfg.text}`}
            >
              {priorityCfg.label}
            </span>
          )}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {deadline && (
            <span
              className={`inline-flex items-center gap-1 ${
                deadline.isOverdue ? "text-destructive font-medium" : ""
              }`}
            >
              <Calendar className="size-3" />
              {deadline.text}
            </span>
          )}

          {todo.repeatType && (
            <Tooltip>
              <TooltipTrigger className="inline-flex items-center gap-1">
                <Repeat className="size-3" />
                {REPEAT_LABELS[todo.repeatType]}
              </TooltipTrigger>
              <TooltipContent>
                Повторяется: {REPEAT_LABELS[todo.repeatType]}
              </TooltipContent>
            </Tooltip>
          )}

          {todo.attachments.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <Paperclip className="size-3" />
              {todo.attachments.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
