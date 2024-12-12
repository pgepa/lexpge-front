import { ScrollText } from 'lucide-react';
import { SectionTitle } from '@/section/section-title';
import { Controller, useFormContext } from 'react-hook-form';

export const AtoNormativoSection = () => {
    const { control } = useFormContext();

    return (
        <div>
            <SectionTitle title="Conteúdo do Ato Normativo" icon={ScrollText} />

            <Controller 
                control={control}
                name='content.atonormativo'
                render={({ field }) => (
                    <textarea {...field}/>
                )}
            />
        </div>
    )
}