import React, { MouseEvent, FormEvent } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

interface ButtonProps {
    element: string;
    onClick?: (event: MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>) => void;
}

const FormButton: React.FC<ButtonProps> = ({ element, onClick }) => {
    return (
        <Stack spacing={2} sx={{ width:"5vw", m: "auto", my: 2}}>
            <Button variant='contained' onClick={onClick}>{element}</Button>
        </Stack>
    )
}

export default FormButton;