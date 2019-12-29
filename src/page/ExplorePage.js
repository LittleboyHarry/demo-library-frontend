import React from 'react'
import { BookGallery } from '../component'

function ExplorePage({ loseFocus }) {
	return <BookGallery disabled={loseFocus} />
}

export default ExplorePage;