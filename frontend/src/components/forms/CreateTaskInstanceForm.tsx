import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
const createContractFormSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(3).max(1000),
  startDate: z.date(),
  endDate: z.date(),
});
export default function CreateTaskInstanceForm() {
  const form = useForm<z.infer<typeof createContractFormSchema>>({
    resolver: zodResolver(createContractFormSchema),
    defaultValues: {
      title: createContractState.title,
      description: createContractState.description,
      startDate: createContractState.startDate,
      endDate: createContractState.endDate,
    },
  });
  return (

  )
}