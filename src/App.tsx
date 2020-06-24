import React from 'react'

const Header = () => {
	return (
		<header>
			<h1>Great People</h1>
		</header>
	)
}

const Main = () => {
	return (
		<main>
			<p>main content</p>
		</main>
	)
}

const Footer = () => {
	return (
		<footer>
			<p>footer content</p>
		</footer>
	)
}

function App() {
	return (
		<>
			<Header/>
			<Main/>
			<Footer/>
		</>
	)
}

export default App
