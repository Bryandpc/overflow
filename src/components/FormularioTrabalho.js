import { useForm } from "react-hook-form";
import FormInput from "./FormInput";
import styles from '@/styles/FormularioTrabalho.module.css';
import BotaoFlutuante from "./BotaoFlutuante";
import { IoClose } from "react-icons/io5";
import { IoIosSave } from "react-icons/io";
import FormSelect from "./FormSelect";
import useSelectOptions from "@/hooks/useSelectOptions";
import { useAddTrabalho, useUpdateTrabalho } from "@/hooks/useTrabalhos";

const FormularioTrabalho = ({
    onSubmit: onSubmitProp,
    onCancel,
    prioridadeInicial = 'baixa',
    trabalhoInicial = null 
}) => {
    const { prioridades } = useSelectOptions();
    
    const { mutateAsync: addTrabalho, isLoading: isAdding } = useAddTrabalho();
    const { mutateAsync: updateTrabalho, isLoading: isUpdating } = useUpdateTrabalho();
    
    const isLoading = isAdding || isUpdating;
    const isEdicao = !!trabalhoInicial;

    const { handleSubmit, formState: { errors }, control } = useForm({
        defaultValues: trabalhoInicial || {
            titulo: '',
            descricao: '',
            prioridade: prioridadeInicial,
            horaInicio: '',
            horaFim: ''
        },
        mode: 'onChange'
    });
    
    const handleFormSubmit = async (dados) => {
        try {
            if (isEdicao) {
                await updateTrabalho({ id: trabalhoInicial.id, ...dados });
            } else {
                await addTrabalho(dados);
            }
            
            if (onSubmitProp) onSubmitProp();
        } catch (error) {
            console.error('Erro ao salvar trabalho:', error);
        }
    };

    return (  
       <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className={styles.formulario}>
           <div className={styles.cabecalhoFormulario}>
               <FormInput
                    name="titulo"
                    control={control}
                    rules={{ required: "Título é obrigatório" }}
                    label="Título"
                    placeholder="Digite o título do trabalho"
                    error={errors.titulo?.message}
                    required
                    customClass={styles.tituloInput}
                />
                <FormSelect
                    name="prioridade"
                    control={control}
                    label="Prioridade"
                    placeholder="Selecione a prioridade"
                    error={errors.prioridade?.message}
                    options={prioridades}
                    customClass={styles.prioridadeSelect}
                />
           </div>
           <FormInput
                name="descricao"
                control={control}
                rules={{ required: "Descrição é obrigatória" }}
                label="Descrição"
                placeholder="Digite a descrição do trabalho"
                error={errors.descricao?.message}
                multiline
                required
            />
            <div className={styles.rodapeFormulario}>
                <FormInput
                    name="horaInicio"
                    control={control}
                    rules={{ 
                        required: "Hora de início é obrigatória" 
                    }}
                    label="Hora de início"
                    placeholder="HH:MM"
                    error={errors.horaInicio?.message}
                    formatType="time"
                    required
                    customClass={styles.horaInput}
                />
                <FormInput
                    name="horaFim"
                    control={control}
                    rules={{ 
                        required: "Hora de término é obrigatória" 
                    }}
                    label="Hora de término"
                    placeholder="HH:MM"
                    error={errors.horaFim?.message}
                    formatType="time"
                    required
                    customClass={styles.horaInput}
                />
            </div>
           <div className={styles.botoes}>
                <BotaoFlutuante 
                    texto={"Cancelar"}
                    aoClicar={onCancel}
                    icone={<IoClose />}
                    isCancelar
                    disabled={isLoading}
                />
                <BotaoFlutuante 
                    texto={isLoading ? "Salvando..." : "Salvar"}
                    type={BotaoFlutuante.Tipos.SUBMIT}
                    // Removendo o evento aoClicar para evitar duplicação, já que o botão tipo submit já aciona o onSubmit do formulário
                    icone={isLoading ? <span className={styles.rotatingIcon}>↻</span> : <IoIosSave />}
                    disabled={isLoading}
                />
           </div>
       </form>
    );
}
 
export default FormularioTrabalho;