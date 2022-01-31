import React, { useEffect, useState } from "react";
import postings from './Postings'
import AddPostingForm from './AddPostingForm'

function PostingList() {
  
    const [jobPostings, setPostings] = useState([]) 

    useEffect(() => {
        postings.getPostings()
        postings.emitter.addListener('GET_POSTINGS_SUCCESS', () => {
            setPostings(postings.data)
        })
    }, [])
  
    const addPosting = (jobPosting) => {
        postings.addPosting(jobPosting)
    }

    return (
    <div>
        <h3>List of Postings</h3>
        {
            jobPostings.map((e) => <div key={e.id}>{e.description}</div>)
        }
        <h3>Add a posting</h3>
        <AddPostingForm onAdd={addPosting} />
    </div>
  );
}

export default PostingList;
