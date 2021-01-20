import { useMemo } from "react"
import { ObservableForm } from "@corets/form"
import { FormBinder } from "./FormBinder"

export const useFormBinder = (form: ObservableForm) =>
  useMemo(() => new FormBinder(form), [form])
