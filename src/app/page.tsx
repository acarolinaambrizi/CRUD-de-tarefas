// ... (keeping the same imports and state)
// ... (keeping all the same functions)

const toggleTask = async (id: string, currentStatus: string) => {
    if (!session?.user) return;
    const newStatus: TaskStatus = currentStatus === "pending" ? "completed" : "pending";
    const completedAt = newStatus === "completed" ? new Date().toISOString() : null;

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus, completed_at: completedAt })
        .eq("id", id);

      if (error) throw error;
      toast.success(newStatus === "completed" ? "Tarefa concluída! 🎉" : "Tarefa reaberta.");
      await refreshTasks(session.user.id);
    } catch {
      toast.error("Erro ao atualizar status.");
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!session?.user) return;
    try {
      const { error } = await supabase.from("tasks").update(updates).eq("id", id);
      if (error) throw error;
      toast.success("Tarefa atualizada.");
      await refreshTasks(session.user.id);
    } catch {
      toast.error("Erro ao atualizar tarefa.");
    }
  };

  const deleteTask = async (id: string) => {
    if (!session?.user) return;
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
      toast.success("Tarefa removida.");
      await refreshTasks(session.user.id);
    } catch {
      toast.error("Erro ao remover tarefa.");
    }
  };
// ... (rest of the component)

// In the TaskItem render:
<TaskItem task={task} onToggle={toggleTask} onDelete={deleteTask} onUpdate={updateTask} />