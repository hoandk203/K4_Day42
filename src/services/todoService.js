import { client } from "../utils/clientUtils";

export const getTodos = async (apiKey) => {
    return await client.get(`/todos`, apiKey);
};

export const addTodo = async (apiKey, body) => {
    return await client.post(`/todos`, body, apiKey);
};

export const updateTodo= async (apikey, body, id)=>{
    return await client.patch(`/todos/${id}`, body, apikey);
}

export const deleteTodo = async (apiKey, id) => {
    return await client.delete(`/todos/${id}`, apiKey);
};

export const searchTodo= async(apiKey, query)=>{
    return await client.get(`/todos?q=${query}`, apiKey)
}
