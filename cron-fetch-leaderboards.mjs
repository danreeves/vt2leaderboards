import https from 'node:https';

const base = 'https://leaderboards.verminti.de/api/'
const seasons = [1, 2, 3, 4]
const types = ['quartet', 'trio', 'duo', 'solo']
const urls = seasons.reduce((acc, season) => {
	types.forEach(type => {
		acc.push(base + String(season) + '/' + type)
	})
	return acc
}, [])


async function fetch(url) {
	console.log('\n', 'season', url.replace(base, ''))
	console.log('> fetching')
	return new Promise((resolve, reject) => {
		https.get(url, resp => {
			console.log('> status:', resp.statusCode)
			resp.on('data', () => {
				// Don't need to do anything with the data
			})
			resp.on('end', () => {
				console.log('> done')
				resolve()
			})
		}).on('error', reject)
	})
}

for (let url of urls) {
	await fetch(url)
}
