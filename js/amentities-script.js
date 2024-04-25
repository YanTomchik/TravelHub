let isAmentitiesLoading = true

const amentitiesList = document.querySelectorAll(`.amentity`)
const amentityDefault = `
    <div class="amentity"><img src="./img/umbrella-icon.svg" alt="amentity-icon" /><p class="amentity-name">Pool</p></div>
`
const amentityWithLoading = `
    <div class="amentity"><span class="amentity-icon-loading shimmer-loading"></span><span class="amentity-name-loading shimmer-loading"></span></div>
`

const loadingStateChange = () => {
    isAmentitiesLoading = !isAmentitiesLoading

    if (isAmentitiesLoading) {
        amentitiesList.forEach(item => {
            item.innerHTML = amentityWithLoading
            return item
        })
    } else {
        amentitiesList.forEach(item => {
            item.innerHTML = amentityDefault
            return item
        })
    }
}

const getData = () => {
    setInterval(() => {
        loadingStateChange()
    }, 2000)
}

getData()