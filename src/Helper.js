
const text = {
    'My friends' : {
        'fr' : 'Mes amis' 
    }
}



export function dateFr(str) {
	var m = str.substring(0,9).split('-') ;
	var da = new Date(m[0], m[1]-1, m[2]) ;
        var day = ''+da.getDate() ; // string
	if (day.length == 1) {
		day = '0'+day ;
	}	
	var str = day + '-' + (da.getMonth()+1 < 10 ? '0'+(da.getMonth()+1) : da.getMonth()+1) + '-' + da.getFullYear() ;
	return str ;        
} ;


export function X(str, lang) {
    return text[str][lang] ? text[str][lang] : str ; 
}