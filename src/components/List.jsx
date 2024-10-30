import React, {useEffect, useState} from 'react'
import { deleteTodo, updateTodo } from '../services/todoService'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let taskUpdate= [];
let deleteTaskId= null;

const List = ({list, setList, setIsLoading}) => {
  
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
  const handleConfirm = (id)=>{
    if(deleteTaskId){
      setIsLoading(true)
      deleteTodo(localStorage.getItem("apiKey"), id).then((response)=>{
        if(response.data.data){
          setIsLoading(false)
          toast.success("Xóa công việc thành công")
          setList(list.filter((item)=>item._id !== id))
          deleteTaskId= null;
        }else{
          setIsLoading(false)
          toast.error("Xóa không thành công, vui lòng tải lại trang")
          localStorage.removeItem("apiKey")
          localStorage.removeItem("userEmail")
          setTimeout(() => {
            window.location.reload()
          }, 3000);
        }
      })
    }
    return
  }

  //handleConfirm
  const handleDelete= (e, id)=>{
    toast.warning("Click vào đây để xác nhận xóa!")
    deleteTaskId= id
    e.target.disabled= true
    setTimeout(()=>{
      e.target.disabled= false
    }, 3000)
    
    
  }

  // onUpdateMode
  const onUpdateMode= (e, item, type)=>{
    e.target.disabled = true
    if(type){
      setList(list.map((listItem)=>{
        if(listItem._id === item._id){
          taskUpdate.push({_id: listItem._id, todo: item.todo, isCompleted: item.isCompleted})
          return {...listItem, isUpdateMode: type}
        }
        return listItem
      }))
    }else{
      setList(list.map((listItem)=>{
        if(listItem._id === item._id){
          // const {_id}= item
          const {_id, todo, isCompleted}= taskUpdate.find((task)=>task._id === item._id)
          taskUpdate= taskUpdate.filter((task)=>{ return task._id !== item._id})
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
    console.log("update");
    e.preventDefault()
    if(!item.todo){
      toast.error("Công việc không được để trống")
      return
    }
    const {todo, isCompleted}= item
    const newItem= {todo, isCompleted}
    setIsLoading(true)
    updateTodo(localStorage.getItem("apiKey"), newItem, item._id).then((response)=>{
      if(response.data.data){
        setIsLoading(false)
        toast.success("Cập nhật thành công")
        taskUpdate= taskUpdate.filter((task)=>{ return task._id !== item._id})
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
        }, 3000)
      }
    })
  }


  return (
    <div className='w-full p-5'>
        <ToastContainer onClick={()=>handleConfirm(deleteTaskId?deleteTaskId:"")} autoClose={3000} toastClassName="cursor-pointer select-none"/>
        <div className='flex flex-col gap-y-4'>
          {Array.isArray(list) && list.length> 0 ? list.map((item, index)=>{
            return(
              <div key={index}>
                {item.isUpdateMode 
                ? <div className='bg-slate-100 p-4 rounded-lg'>
                    <form onSubmit={(e)=>{handleUpdate(e, item)}}>
                      {item.isCompleted
                      ? <input onChange={(e)=>{handleChange(e, item)}} value={item.todo} required  type="text" id="first_name" className="line-through mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
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
                          <button type='button' onClick={(e)=>{onUpdateMode(e, item, false)}} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Thoát</button>
                          <button type='submit' className="text-white bg-orange-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800">Cập nhật</button>
                          <button type='button' onClick={(e)=>handleDelete(e, item._id)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Xóa</button>
                        </div>
                      </div>
                    </form>
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
          })
        : <div className="bg-slate-100 p-4 rounded-lg"><p className='text-lg font-bold text-center text-black'>Không có công việc nào</p></div>}
        </div>
    </div>
  )
}

export default List