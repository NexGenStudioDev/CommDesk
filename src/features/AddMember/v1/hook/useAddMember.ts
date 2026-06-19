import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MemberValidationSchema,
  type MemberFormValues,
  type MemberSubmitValues,
} from "../Validator/AddMember.Validator";

export function useAddMember() {
  return useForm<MemberFormValues, unknown, MemberSubmitValues>({
    resolver: zodResolver(MemberValidationSchema),

    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      primaryRole: "",
      location: "",
      skills: [],
      areaOfInterest: [],
      internalNotes: "",
      imageUrl: "",
      publicProfileUrl: "",
    },
  });
}
