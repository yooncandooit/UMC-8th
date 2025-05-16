import {createContext,PropsWithChildren, useState,useContext} from 'react';

export enum THEME{
    LIGHT='LIGHT',
    DARK='DARK',
}

type TTheme=THEME.LIGHT|THEME.DARK;

interface IThemeContext{
    theme:TTheme,
    toggleTheme: ()=> void;
}



export const ThemeContext=createContext<IThemeContext|undefined>(undefined);

export const ThemeProvider=({children}:PropsWithChildren)=>{
    const [theme,setTheme]=useState<TTheme>(THEME.LIGHT);

    const toggleTheme=(): void=>{
        setTheme((prevTheme):THEME => prevTheme===THEME.LIGHT?THEME.DARK:THEME.LIGHT);
    };
    return(
        <ThemeContext.Provider value={{theme,toggleTheme}}>{children}</ThemeContext.Provider>
    )
}

export const useTheme=()=>{
    const context=useContext(ThemeContext);

    if(!context){
        throw new Error('use Theme must be used within a Themeprovider');
    }

    return context;
}