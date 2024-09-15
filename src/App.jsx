import './App.css'
import {
  Button,
  Center,
  Flex,
  MantineProvider,
  NumberInput,
  SimpleGrid,
  TextInput
} from '@mantine/core'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch } from 'react-redux'
import { updateApp, updateStatus } from './appSlice.js'

const validationSchema = z.object({
  gymForm: z.array(
    z.object({
      category: z.string().min(1),
      exercise: z.string().min(1),
      sets: z.number().min(1),
      reps: z.number().min(1)
    })
  )
})

function App() {
  const [submittedDData, setSubmittedDData] = useState()
  const {
    register,
    control,
    handleSubmit,
    formState: { isValid, errors, isValidating, isDirty },
    watch,
    reset
  } = useForm({
    defaultValues: {
      gymForm: [{ category: null, exercise: null, sets: null, reps: null }]
    },
    resolver: zodResolver(validationSchema),
    mode: 'all'
  })
  const { fields, remove, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'gymForm' // unique name for your Field Array
  })
  const whatDoesRegisterDo = register(`gymForm.${0}.category`, {
    required: true
  })
  const dispatch = useDispatch()
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log(value, name, type)
      dispatch(updateApp(structuredClone(value.gymForm)))
    })
    return () => subscription.unsubscribe()
  }, [watch])

  useEffect(() => {
    dispatch(updateStatus({ isDirty, isValid }))
  }, [isDirty, isValid])
  // console.log('whatDoesRegisterDo', whatDoesRegisterDo)
  // console.log('errors', errors)
  // console.log(handleSubmit)
  const isSubmittable = !!isDirty && !!isValid
  return (
    <MantineProvider>
      <Center h={200}>
        <Button onClick={() => insert(1)}>Add New Row</Button>
      </Center>
      <SimpleGrid cols={5}>
        {fields.map((item, index) => {
          /*
          console.log(
            'errors?.gymForm?.[index]?.exercise.message',
            errors?.gymForm?.[index]?.exercise.message
          )
           */

          /*
           * what's different between Controller and register, both are working for Mantine?
           * */
          return (
            <React.Fragment key={item.id}>
              <TextInput
                label="Category"
                placeholder="Upper"
                error={errors?.gymForm?.[index]?.category?.message}
                {...register(`gymForm.${index}.category`)}
              />
              <Controller
                render={({ field }) => {
                  // console.log('whatdoesfielddo', field)
                  return (
                    <TextInput
                      label="Exercise"
                      placeholder="Ex. squats"
                      error={errors?.gymForm?.[index]?.exercise?.message}
                      {...field}
                    />
                  )
                }}
                name={`gymForm.${index}.exercise`}
                control={control}
              />

              <Controller
                render={({ field }) => (
                  <NumberInput
                    label="Sets"
                    placeholder="Ex. 3"
                    error={errors?.gymForm?.[index]?.sets?.message}
                    {...field}
                  />
                )}
                name={`gymForm.${index}.sets`}
                control={control}
              />
              <Controller
                render={({ field }) => (
                  <NumberInput
                    label="Reps"
                    placeholder="Ex. 10"
                    error={errors?.gymForm?.[index]?.reps?.message}
                    {...field}
                  />
                )}
                name={`gymForm.${index}.reps`}
                control={control}
              />
              <Button onClick={() => remove(index)}>Remove Row</Button>
            </React.Fragment>
          )
        })}
      </SimpleGrid>
      <Center h={200}>
        <Button
          disabled={!isSubmittable}
          onClick={handleSubmit(data => {
            console.log('Data submitted:', data)
            setSubmittedDData(data)
            // reset()
          })}
        >
          SUBMIT
        </Button>
      </Center>
      {submittedDData && <>{JSON.stringify(submittedDData)}</>}
    </MantineProvider>
  )
}

export default App
