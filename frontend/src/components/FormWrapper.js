const FormWrapper = (props) => {
  return (
    <div
      className='width-[60%] mx-[20%] my-[1%] rounded-[6px] bg-[rgba(0,0,0,0.8)] text-white p-2
  '
    >
      {props.children}
    </div>
  );
};

export default FormWrapper;
