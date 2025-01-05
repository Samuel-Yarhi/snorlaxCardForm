const customSelectStyles = {
    control: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: '#1f2937',
        borderColor: state.isFocused ? '#cc6e49 !important' : '#9ca3af !important',
        borderRadius: '0.5rem',
        borderWidth: '3px',
        padding: '2px',
        width: '100%',
        outline: 'none',
        boxShadow: 'none',
        marginTop: '0.25rem', // Same margin as input (tailwind's mt-1 is 0.25rem)
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#6c4f3d' : state.isFocused ? '#2d3d45' : '#1f2937',
        color: '#f3d2b4',
        padding: '10px',
        '&:hover': {
            backgroundColor: '#2d3d45',
        },
    }),
    menu: (provided: any) => ({
        ...provided,
        backgroundColor: '#1f2937',
        borderRadius: '0.5rem',
        borderColor: '#6c4f3d',
        padding: '8px 0',
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: '#f3d2b4',
    }),
    indicatorSeparator: (provided: any) => ({
        ...provided,
        backgroundColor: 'transparent',
    }),
    input: (provided: any) => ({
        ...provided,
        color: '#f3d2b4',
    }),
};

export default customSelectStyles;