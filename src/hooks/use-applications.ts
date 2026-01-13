import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserApplications, createApplication, updateApplication, deleteApplication } from "@/lib/firestore";
import { Application } from "@/lib/types";
import { auth } from "@/lib/firebase";

export const useApplications = () => {
    const user = auth.currentUser;
    return useQuery({
        queryKey: ["applications", user?.uid],
        queryFn: () => getUserApplications(user!.uid),
        enabled: !!user,
    });
};

export const useCreateApplication = () => {
    const queryClient = useQueryClient();
    const user = auth.currentUser;
    return useMutation({
        mutationFn: (data: Partial<Application>) => createApplication(user!.uid, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["applications"] }),
    });
};

export const useUpdateApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Application> }) => updateApplication(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["applications"] }),
    });
};

export const useDeleteApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteApplication(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["applications"] }),
    });
};
