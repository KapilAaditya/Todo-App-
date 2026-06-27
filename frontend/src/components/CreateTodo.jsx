import { useState } from "react";
import "./CreateTodo.css"

export function CreateTodo() {
    const [title, setTitle] = useState("")
    const [disc, setDesc] = useState("")
    return (
        <>
            <h1 className="heading">
                Basic Todo Application
            </h1>
            <div className="flex">
                <input id="title" type="text" placeholder="Title"
                    onChange={
                        function (e) {
                            const value = e.target.value
                            setTitle(e.target.value)
                        }
                    }
                    />
                <br />
            </div>
            <div>
                <textarea id="desc" type="text" placeholder="Description"
                    onChange={
                        function (e) {
                            const value = e.target.value
                            setDesc(e.target.value)
                        }
                    } />
                <br />
                <div className="button-container">

                    {/* Fixed: Wrapped inside an anonymous function () => { ... } */}
                    <button onClick={() => {
                        fetch('http://localhost:4000/todo', {
                            method: "POST",
                            body: JSON.stringify(
                                {
                                    title: title,
                                    description: disc
                                }
                            ),
                            // Fixed: Corrected "contentType" to "Content-Type"
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })
                            .then(async (res) => {
                                const json = await res.json()
                                alert("Todo has been added successfully")
                            })
                    }}
                    >Add a Todo</button><br />
                </div>
            </div>
        </>
    )
}