import React from 'react';
import { View } from 'react-native';
import { Formik, FormikConfig, FormikValues, FormikProps } from 'formik';

type AppFormProps<Values extends FormikValues> = {
    formStyles?: string;
    children: React.ReactNode | ((props: FormikProps<Values>) => React.ReactNode);
} & FormikConfig<Values>;

const AppForm = <Values extends FormikValues>({
    initialValues,
    onSubmit,
    validationSchema,
    formStyles,
    children,
    ...rest
}: AppFormProps<Values>) => {
    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
            {...rest}
        >
            {(formikProps) => (
                <View className={`flex flex-col gap-4 ${formStyles} w-full`}>
                    {typeof children === 'function' ? children(formikProps) : children}
                </View>
            )}
        </Formik>
    );
}

export default AppForm;