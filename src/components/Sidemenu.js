import data from './../data/rest.json'
function SideMenu(props){
    return(
        <div className="ml-20 pl-0 vh-100" style={{backgroundColor: '#3c414b'}}>
            <div class="text-bolder p-4">rAPI</div>
            <div style={{marginTop: 100, padding: 8, fontWeight: 'bold'}}>
                Resources
            </div>
            <div style={{marginLeft: 14}}>
                {data.resources.map((item, value) => {
                    return(
                        <div style={{cursor: 'pointer'}} onClick={() =>props.onResourceItemClick(item.name)}>{item.name}</div>
                    )
                })}
            </div>
        </div>
    )
}

export default SideMenu;