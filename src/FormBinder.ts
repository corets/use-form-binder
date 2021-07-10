import {
  ButtonBindingOptions,
  CheckboxBinding,
  FormBindingOptions,
  InputBinding,
  ObservableFormBinder,
  RadioBinding,
  SelectBinding,
  SubmitBinding,
  SubmitButtonBinding,
} from "./types"
import { ObservableForm } from "@corets/form"

export class FormBinder implements ObservableFormBinder {
  target: ObservableForm

  constructor(target: ObservableForm) {
    this.target = target
  }

  form(options: FormBindingOptions = {}): SubmitBinding {
    options = { ...{ validate: undefined }, ...options }

    return {
      onSubmit: (e) => {
        e.preventDefault()
        this.target.submit({ validate: options.validate })
      },
    }
  }

  button(options: ButtonBindingOptions = {}): SubmitButtonBinding {
    options = { ...{ validate: undefined, disableOnSubmit: true }, ...options }

    return {
      disabled: !!(options.disableOnSubmit && this.target.isSubmitting()),
      onClick: (e) => {
        e.preventDefault()
        this.target.submit({ validate: options.validate })
      },
    }
  }

  input(path: string): InputBinding {
    return {
      name: path,
      value: this.target.getAt(path),
      onChange: (e) => this.target.setAt(path, e.target.value),
    }
  }

  select(path: string): SelectBinding {
    return this.input(path)
  }

  checkbox(path: string): CheckboxBinding {
    return {
      name: path,
      checked: !!this.target.getAt(path),
      onChange: (e) => this.target.setAt(path, !!e.target.checked),
    }
  }

  radio(path: string, value: any = true): RadioBinding {
    return {
      name: path,
      checked: value === this.target.getAt(path),
      onChange: () => this.target.setAt(path, value),
    }
  }
}
