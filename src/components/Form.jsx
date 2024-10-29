import React, {useState, useCallback, useEffect} from 'react'
import {addTodo, searchTodo } from '../services/todoService.js'
import {toast} from 'react-toastify'
import debounce from 'lodash.debounce'

const Form = ({list, setList, setIsLoading}) => {
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [task, setTask] = useState({
    todo: "",
    isCompleted: false,
  })

  const handleAdd =(e)=>{
    e.target.disabled= true;
    if(!task.todo){
      toast.error("Công việc không được để trống")
      e.target.disabled= false;
      return
    }
    setIsLoading(true)
    addTodo(localStorage.getItem("apiKey"), task).then((response)=>{
      if(response.data.data){
        setIsLoading(false)
        e.target.disabled= false;
        toast.success("Thêm công việc thành công")
        setList([task,...list])
      }else{
        setIsLoading(false)
        toast.error("Thêm không thành công, vui lòng tải lại trang")
        localStorage.removeItem("apiKey")
        localStorage.removeItem("userEmail")
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      }
    })
    setTask({
      todo: "",
      isCompleted: false,
    })
  }

  const toggleSearchMode= (type)=>{
    setIsSearchMode(!isSearchMode)
    if(type === "search"){
      toast.success("Chuyển sang chế độ tìm kiếm")
    }else{
      toast.success("Chuyển sang chế độ thêm công việc")
    }
  }

  const fetchSearch= async (query)=>{
    setIsLoading(true)
    searchTodo(localStorage.getItem("apiKey"), query).then((response)=>{
      if(response.data.data){
        setIsLoading(false)
        console.log(response.data.data);
        setList([...response.data.data.listTodo])
      }else{
        setIsLoading(false)
        toast.error("Tìm kiếm không thành công, vui lòng tải lại trang")
        localStorage.removeItem("apiKey")
        localStorage.removeItem("userEmail")
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      }
    })
    
  }

  const debounceSearch = useCallback(debounce((nextValue) => fetchSearch(nextValue), 1000), [])

  const handleChange= (e)=>{
    setTask({...task, todo: e.target.value})
  }

  useEffect(()=>{
    if(isSearchMode){
      debounceSearch(task.todo)
    }
  }, [task])

  return (
    <div>
        {isSearchMode
        ? <div className='flex gap-y-2'>
            <div className='flex gap-x-2'>
                <input onChange={handleChange} value={task.todo} placeholder="Tìm tên công việc" required  type="text" id="first_name" className="min-w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                <button onClick={handleAdd} type="button" className="h-full focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Thêm</button>
            </div>
            <div>
              <button onClick={()=>{toggleSearchMode("add")}} type="submit" className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Tìm kiếm
              </button>
            </div>
          </div>
        : <div className='flex gap-y-2'>
            <div className='flex gap-x-2'>
                <input onChange={handleChange} value={task.todo} placeholder="Thêm công việc" required  type="text" id="first_name" className="min-w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                <button onClick={handleAdd} type="button" className="h-full focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Thêm</button>
            </div>
            <div>
              <button onClick={()=>{toggleSearchMode("search")}} type="submit" className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Tìm kiếm
              </button>
            </div>
          </div>}
    </div>
  )
}

export default Form