import { LANGUAGES } from '../../utils/constants'

function LanguagesSelector({ language, onLanguageChange }){
    return (
        <select 
           value={language}
           onChange={(e) => onLanguageChange(e.target.value)}
           style= {{
              background: '#2d2d2d',
              color: '#cccccc',
              border: '1px solid #555',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              cursor: 'pointer',
           }}
        >
            {
                LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                        {lang.label}
                    </option>
                ))
            }
        </select>
    )
}

export default LanguagesSelector