import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  answers: yup.array().of(
    yup.object().shape({
      value: yup.string().required(),
    })
  ),
});

const questions = [
  "What is 2 + 2?",
  "What is the capital of France?",
  "Is the sun hot?",
  "Is the sky blue?",
  "What is 5 * 5?",
  "Is the Earth round?",
];

const MyForm = () => {
  const { control, handleSubmit, setError, formState } = useForm({
    resolver: yupResolver(schema),
  });
  const { fields, append } = useFieldArray({
    control,
    name: "answers",
  });

  const onSubmit = (data) => {
    // You can handle the form submission here.
    // Check if the answers are correct and submit the form if required.
    // For this example, we're just logging the answers.
    console.log(data.answers);
  };

  const handleNextQuestion = (answer) => {
    if (fields.length < questions.length) {
      append({ value: answer });
    }
  };

  useEffect(() => {
    if (fields.length === 0) {
      // Display the first question on load
      append({ value: "" });
    }
  }, [fields]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={index}>
          <h2>Question {index + 1}</h2>
          <p>{questions[index]}</p>
          <Controller
            name={`answers[${index}].value`}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div>
                <label>
                  <input
                    type="radio"
                    {...field}
                    value="correct"
                    onChange={() => handleNextQuestion("correct")}
                    disabled={formState.isSubmitting || index !== fields.length - 1}
                  />
                  Correct
                </label>
                <label>
                  <input
                    type="radio"
                    {...field}
                    value="incorrect"
                    onChange={() => handleNextQuestion("incorrect")}
                    disabled={formState.isSubmitting || index !== fields.length - 1}
                  />
                  Incorrect
                </label>
                <label>
                  <input
                    type="radio"
                    {...field}
                    value="skip"
                    onChange={() => handleNextQuestion("skip")}
                    disabled={formState.isSubmitting || index !== fields.length - 1}
                  />
                  Skip
                </label>
              </div>
            )}
          />
        </div>
      ))}
      <button type="submit" disabled={fields.length !== questions.length}>
        Submit
      </button>
    </form>
  );
};

export default MyForm;
