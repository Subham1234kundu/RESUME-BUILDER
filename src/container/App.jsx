import React, { Suspense } from 'react';
import { Route,Routes } from 'react-router-dom';
import { HomeScreen,Authentication } from '../pages';
import { QueryClient,QueryClientProvider } from 'react-query';
import {ReactQueryDevtools} from "react-query/devtools";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
    const queryClient =  new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path='/*' element={<HomeScreen/>}/>
                <Route path='/auth' element={<Authentication/>}/>
            </Routes>
            </Suspense>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    )
}

export default App
