import { useState } from "react";


interface ChildProps {
    value: number;
    setValue: (value: number) => void;
    children: React.ReactNode;
}

function Child(props: ChildProps) { // Change here to accept props of type ChildProps
    return (
        <div>
            <h1> this is value in child {props.value}</h1> {/* Use props.value */}
            <button onClick={() => props.setValue(props.value + 1)}>Increment</button>
        </div>
    );
}




function Parent() {
 
    const [myvalue, setValue] = useState(0);

    return (
        <div>
            <Child value = {myvalue} setValue = {setValue}> This is child</Child>
            <p> This is the value in Parent {myvalue}.</p>
        </div>
    );
}

export default Parent;




