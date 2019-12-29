import React from 'react'
import { BookGallery } from '../component'

function ExplorePage({ isBackground }) {
	return <BookGallery disabled={isBackground} />
}

export default ExplorePage;