import React, {useEffect, useState} from 'react'
import { deleteTodo, updateTodo } from '../services/todoService'
import { toast } from 'react-toastify'

const List = ({list, setList, setIsLoading}) => {
  const [task, setTask]= useState({
    todo: "",
    isCompleted: false
  }) //bam thoat khong luu lai ten
  
  // handleChange
  const handleChange = (e, item)=>{
    setList(list.map((listItem)=>{
      if(listItem._id === item._id){
        return {...listItem, todo: e.target.value}
      }
      return listItem
    }))
  }

  // handleDelete
  const handleDelete = (e, id)=>{
    setIsLoading(true)
    e.target.disabled = true
    deleteTodo(localStorage.getItem("apiKey"), id).then((response)=>{
      if(response.data.data){
        setIsLoading(false)
        toast.success("Xóa công việc thành công")
        e.target.disabled = false
        setList(list.filter((item)=>item._id !== id))
      }else{
        setIsLoading(false)
        toast.error("Xóa không thành công, vui lòng tải lại trang")
        localStorage.removeItem("apiKey")
        localStorage.removeItem("userEmail")
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      }
    })
  }

  // onUpdateMode
  const onUpdateMode= (e, item, type)=>{
    e.target.disabled = true

    
    if(type){
      setTask({id: item._id, todo: item.todo, isCompleted: item.isCompleted})
      setList(list.map((listItem)=>{
        if(listItem._id === item._id){
          return {...listItem, isUpdateMode: type}
        }
        return listItem
      }))
    }else{
      setList(list.map((listItem)=>{
        if(listItem._id === item._id){
          const {_id, todo, isCompleted}= task
          const newItem= {_id, todo, isCompleted}
          return {...newItem}
        }
        return listItem
      }))
    }
  }

  // checkComplete
  const checkComplete= (item)=>{
    setList(list.map((listItem)=>{
      if(listItem._id === item._id){
        return {...listItem, isCompleted: !listItem.isCompleted}
      }
      return listItem
    }))
  }

  // handleUpdate
  const handleUpdate= (e, item)=>{
    e.target.disabled = true
    if(!item.todo){
      toast.error("Công việc không được để trống")
      e.target.disabled= false;
      return
    }
    const {todo, isCompleted}= item
    const newItem= {todo, isCompleted}
    setIsLoading(true)
    updateTodo(localStorage.getItem("apiKey"), newItem, item._id).then((response)=>{
      if(response.data.data){
        setIsLoading(false)
        toast.success("Cập nhật thành công")
        e.target.disabled = false
        setList(list.map((listItem)=>{
          if(listItem._id === item._id){
            return {...listItem, isUpdateMode: false}
          }
          return listItem
        }))
      }else{
        setIsLoading(false)
        toast.error("Cập nhật không thành công")
        e.target.disabled = false
        localStorage.removeItem("apiKey")
        localStorage.removeItem("userEmail")
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    })
  }


  return (
    <div className='w-full p-5'>
        <div className='flex flex-col gap-y-4'>
          {Array.isArray(list) && list.map((item, index)=>{
            return(
              <div key={index}>
                {item.isUpdateMode 
                ? <div className='bg-slate-100 p-4 rounded-lg'>
                    {item.isCompleted
                    ? <input value={item.todo} required  type="text" id="first_name" className="line-through mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                    : <input onChange={(e)=>{handleChange(e, item)}} value={item.todo} required  type="text" id="first_name" className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>}
                    <div className='flex justify-between items-center'>
                      {item.isCompleted 
                      ? <div className="flex items-center">
                          <input onChange={()=>{checkComplete(item)}} checked={item.isCompleted} id={`default-checkbox${index}`} type="checkbox" value="" className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                          <label htmlFor={`default-checkbox${index}`} className="ms-2 text-lg font-medium text-black">Đã hoàn thành</label>
                        </div>
                      : <div className="flex items-center">
                          <input onChange={()=>{checkComplete(item)}} checked={item.isCompleted} id={`default-checkbox${index}`} type="checkbox" value="" className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                          <label htmlFor={`default-checkbox${index}`} className="ms-2 text-lg font-medium text-black">Chưa hoàn thành</label>
                        </div>}
                      <div>
                        <button onClick={(e)=>{onUpdateMode(e, item, false)}} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Thoát</button>
                        <button onClick={(e)=>{handleUpdate(e, item)}} className="text-white bg-orange-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800">Cập nhật</button>
                        <button onClick={(e)=>handleDelete(e, item._id)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Xóa</button>
                      </div>
                    </div>
                  </div>
                : <div className='bg-slate-100 p-4 rounded-lg'>
                    {item.isCompleted
                    ? <input onChange={handleChange} value={item.todo} disabled type="text" id="first_name" className="line-through mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                    : <input onChange={handleChange} value={item.todo} disabled type="text" id="first_name" className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>}
                    <button onClick={(e)=>{onUpdateMode(e, item, true)}} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Sửa</button>
                    <button onClick={(e)=>handleDelete(e, item._id)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Xóa</button>
                  </div>}
              </div>
            )
          })}
        </div>
    </div>
  )
}

export default List