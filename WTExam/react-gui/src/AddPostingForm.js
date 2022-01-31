import React, { useEffect, useState } from "react";

function AddPostingForm (props) {
    const {onAdd} = props
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState('')

    const add = (evt) => {
        onAdd({
            description,
            deadline
        })
    }

    return (
        <div>
            <div>
                <input type='text' placeholder='description' value={description} onChange={(evt) => setDescription(evt.target.value)} />
            </div>
            <div>
                <input type='date' placeholder='deadline' value={deadline} onChange={(evt) => setDeadline(evt.target.value)} />
            </div>
            <div>
                <input type='button' value='add posting' onClick={add}/>
            </div>
        </div>
    )
}

export default AddPostingForm