import React, { useCallback, useMemo, useState } from 'react'
import moment from 'moment'
import Grid from 'src/uikit/Grid'
import Button from 'material-ui/Button/Button'
import Editor from 'src/uikit/Editor'
import { PrismaCmsEditorRawContent } from '@prisma-cms/editor/dist'
import { TextField, Typography } from 'material-ui'
import { TaskFormProps } from './interfaces'
import { TaskStatus } from 'src/modules/gql/generated'
import Autocomplete from 'src/uikit/Autocomplete'

/**
 * Форма создания/редактирования задачи
 */
const TaskForm: React.FC<TaskFormProps> = ({
  task,
  variables: variablesProp,
  mutationState,
  onCancel: onCancelProp,
}) => {
  type Data = typeof variablesProp.data
  type Name = keyof Data

  const [data, setData] = useState(variablesProp.data)

  const dataWithMutations = useMemo(() => {
    return {
      ...task,
      ...data,
    }
  }, [task, data])

  /**
   * Получаем текущее значение объекта
   */
  const getValue = useCallback(
    <P extends keyof typeof dataWithMutations>(name: P) => {
      return dataWithMutations[name]
    },
    [dataWithMutations]
  )

  const setValue = useCallback(
    <Name extends keyof Data>(name: Name, value: Data[Name]) => {
      setData({
        ...data,
        [name]: value,
      })
    },
    [data]
  )

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.name as Name
      const value = event.target.value

      if (!name) {
        return
      }

      const newData: typeof variablesProp.data = {
        ...data,
      }

      switch (name) {
        case 'name':
          newData[name] = value

          break

        case 'startDate':
        case 'startDatePlaning':
        case 'endDate':
        case 'endDatePlaning':
          {
            const date =
              value && typeof value === 'string' ? new Date(value) : null

            newData[name] = date
          }
          break

        default:
          console.error(new Error(`Unhandled field name "${name}"`))
      }

      setValue(name, value)
    },
    [data, setValue, variablesProp]
  )

  const resetForm = useCallback(() => {
    // setOpened(false)
    setData(variablesProp.data)
  }, [variablesProp.data])

  const errors = mutationState.errors

  const onSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault()
      /**
       * Save task
       */
      mutationState.mutation({
        variables: {
          ...variablesProp,
          data,
        },
      })
    },
    [data, mutationState, variablesProp]
  )

  const onEditorChange = useCallback(
    (content: PrismaCmsEditorRawContent) => {
      setValue('content', content)
    },
    [setValue]
  )

  /**
   * Удаляем ошибку при фокусе
   */
  const onFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const name = event.target.name

      const error = errors.find((n) => n.key === name)

      error && mutationState.removeError(error)
    },
    [mutationState, errors]
  )

  /**
   * Название
   */
  const name = useMemo(() => {
    const fieldName: Name = 'name'

    const error = errors.find((n) => n.key === fieldName)

    return (
      <TextField
        name={fieldName}
        onChange={onChange}
        value={getValue(fieldName) || ''}
        fullWidth
        label="Название задачи"
        error={!!error}
        helperText={error?.message}
        onFocus={onFocus}
      />
    )
  }, [errors, onChange, getValue, onFocus])

  const startDatePlaning = useMemo(() => {
    const fieldName: Name = 'startDatePlaning'

    const error = errors.find((n) => n.key === fieldName)

    let value: typeof data.startDatePlaning | string = getValue(fieldName)

    if (value && value instanceof Date) {
      value = moment(value).format('YYYY-MM-DD')
    }

    return (
      <TextField
        name={fieldName}
        onChange={onChange}
        value={value || ''}
        type="date"
        fullWidth
        error={!!error}
        helperText={error?.message || 'Планируемая дата начала'}
        onFocus={onFocus}
      />
    )
  }, [data, errors, getValue, onChange, onFocus])

  const endDatePlaning = useMemo(() => {
    const fieldName: Name = 'endDatePlaning'

    const error = errors.find((n) => n.key === fieldName)

    let value: typeof data.endDatePlaning | string = getValue(fieldName)

    if (value && value instanceof Date) {
      value = moment(value).format('YYYY-MM-DD')
    }

    return (
      <TextField
        name={fieldName}
        onChange={onChange}
        value={value || ''}
        type="date"
        fullWidth
        error={!!error}
        helperText={error?.message || 'Планируемая дата завершения'}
        onFocus={onFocus}
      />
    )
  }, [data, errors, getValue, onChange, onFocus])

  const startDate = useMemo(() => {
    const fieldName: Name = 'startDate'

    const error = errors.find((n) => n.key === fieldName)

    let value: typeof data.startDate | string = getValue(fieldName)

    if (value && value instanceof Date) {
      value = moment(value).format('YYYY-MM-DD')
    }

    return (
      <TextField
        name={fieldName}
        onChange={onChange}
        value={value || ''}
        type="date"
        fullWidth
        error={!!error}
        helperText={error?.message || 'Дата начала'}
        onFocus={onFocus}
      />
    )
  }, [data, errors, getValue, onChange, onFocus])

  const endDate = useMemo(() => {
    const fieldName: Name = 'endDate'

    const error = errors.find((n) => n.key === fieldName)

    let value: typeof data.endDate | string = getValue(fieldName)

    if (value && value instanceof Date) {
      value = moment(value).format('YYYY-MM-DD')
    }

    return (
      <TextField
        name={fieldName}
        onChange={onChange}
        value={value || ''}
        type="date"
        fullWidth
        error={!!error}
        helperText={error?.message || 'Дата завершения'}
        onFocus={onFocus}
      />
    )
  }, [data, errors, getValue, onChange, onFocus])

  const onCancel = useCallback(() => {
    resetForm()
    onCancelProp && onCancelProp()
  }, [onCancelProp, resetForm])

  const onStatusChange = useCallback(
    (value: keyof typeof TaskStatus) => {
      // console.log('onStatusChange value', value);
      // console.log('onStatusChange item', item);

      const status = TaskStatus[value]

      setValue('status', status)
    },
    [setValue]
  )

  const status = useMemo(() => {
    /**
     * Не даем указывать статус для новых задач
     */
    if (!task?.id) {
      return null
    }

    // console.log("TaskStatus", TaskStatus);

    // const items = Object.values(TaskStatus).map(name => ({
    //   value: name,
    //   label: name,
    // }));

    // keys

    const keys = Object.keys(TaskStatus) as Array<keyof typeof TaskStatus>
    const items = keys.map((key) => ({
      value: key,
      label: TaskStatus[key],
    }))

    return (
      <Autocomplete
        items={items}
        value={getValue('status') || ''}
        // onChange={onStatusChange}
        onSelect={onStatusChange}
        inputProps={{
          label: 'Статус',
        }}
      />
    )
  }, [getValue, onStatusChange, task?.id])

  return useMemo(() => {
    const content = data.content

    return (
      <>
        <form onSubmit={onSubmit}>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Grid container spacing={8} alignItems="baseline">
                <Grid item xs>
                  {name}
                </Grid>

                <Grid item>{status}</Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="caption">Описание задачи</Typography>
              <Editor
                editorKey="task-editor"
                onChange={onEditorChange}
                value={content}
                readOnly={false}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              {startDatePlaning}
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              {endDatePlaning}
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              {startDate}
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              {endDate}
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={8}>
                <Grid item xs></Grid>

                <Grid item>
                  <Button
                    variant="raised"
                    disabled={mutationState.loading}
                    onClick={onCancel}
                  >
                    Отмена
                  </Button>
                </Grid>

                <Grid item>
                  <Button
                    type="submit"
                    variant="raised"
                    color="primary"
                    disabled={mutationState.loading}
                  >
                    Сохранить
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
        {mutationState.snakbar}
      </>
    )
  }, [
    onSubmit,
    data.content,
    endDate,
    endDatePlaning,
    mutationState.loading,
    mutationState.snakbar,
    name,
    onCancel,
    onEditorChange,
    startDate,
    startDatePlaning,
    status,
  ])
}

export default TaskForm
