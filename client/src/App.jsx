import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'

import Welcome from './pages/Welcome'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'

const App = () => {
	return (
		<div className='flex flex-col min-h-screen min-w-full'>
			<BrowserRouter>
				<Header/>
				<div className='h-[calc(100vh-50px)] overflow-y-scroll'>
					<Routes>
						<Route path='/' element={<Welcome/>}/>
						<Route path='/dashboard' element={<Dashboard/>}/>
					</Routes>
				</div>
			</BrowserRouter>
		</div>
	)
}

export default App