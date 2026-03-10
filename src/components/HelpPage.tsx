import { ArrowLeft, BookOpen, Building2, Users, Calendar, ShieldCheck, Briefcase } from 'lucide-react';

interface HelpPageProps {
    onBack: () => void;
}

export function HelpPage({ onBack }: HelpPageProps) {
    return (
        <div className="min-h-screen bg-slate-50 relative overflow-y-auto pb-12">
            {/* Header */}
            <div className="bg-slate-900 text-white pt-12 pb-24 px-6 md:px-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900"></div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all mb-8 font-medium backdrop-blur-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao Login
                    </button>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/30">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Manual de Utilização</h1>
                    </div>
                    <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
                        Bem-vindo à plataforma de Gestão de Férias. Aprenda abaixo como extrair o máximo de produtividade do sistema e entender como a sua organização é mapeada.
                    </p>
                </div>
            </div>

            {/* Content Cards */}
            <div className="max-w-4xl mx-auto px-6 md:px-12 -mt-12 relative z-20 space-y-6">

                {/* Section 1: Administrator */}
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl shrink-0">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Painel de Administração da Empresa</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Os administradores têm acesso a ferramentas de gestão que modelam a forma como a empresa opera dentro da plataforma.
                            </p>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 pl-12">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                <Users className="w-4 h-4 text-indigo-500" /> Funcionários
                            </h3>
                            <p className="text-sm text-slate-600">
                                Crie as contas para a sua equipa, gerando automaticamente um Código de Acesso. Defina também quem são os administradores com acesso ao painel de gestão.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-indigo-500" /> Estrutura (Departamentos e Cargos)
                            </h3>
                            <p className="text-sm text-slate-600">
                                O sistema é altamente customizável. Na lista de Funcionários pode clicar em <strong>"Departamentos"</strong> ou <strong>"Cargos"</strong> para criar secções à medida da sua empresa (ex: 'Recursos Humanos', 'Armazém'). Estas opções ficam restritas apenas à sua empresa.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Employees */}
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl shrink-0">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Para Colaboradores (Funcionários)</h2>
                            <p className="text-slate-600 leading-relaxed">
                                A conta base de cada utilizador concentra-se exclusivamente em marcações de férias e consulta do calendário geral da sua organização.
                            </p>
                        </div>
                    </div>

                    <ul className="space-y-4 pl-12">
                        <li className="flex gap-3 text-slate-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></div>
                            <p><strong>Aceder à conta:</strong> Use o email fornecido pelo seu administrador e coloque o seu código pessoal no campo "Código de Acesso".</p>
                        </li>
                        <li className="flex gap-3 text-slate-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></div>
                            <p><strong>Marcar Férias:</strong> No painel principal ('O Meu Dashboard'), utilize o botão "Nova Marcação". O sistema deduz automaticamente o número de dias no seu escalão anual. Feriados Nacionais em dias úteis não contabilizam nos gastos de férias.</p>
                        </li>
                        <li className="flex gap-3 text-slate-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></div>
                            <p><strong>Consultar Calendário:</strong> O separador de Calendário permite visualizar todas as férias marcadas na empresa. Pode utilizar os filtros por "Cargo" ou "Departamento" ou ainda "Mês/Ano" para facilitar a procura caso a equipa seja de grande dimensão.</p>
                        </li>
                    </ul>
                </div>

                {/* Section 3: Reminders/Security */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-slate-900">Regras e Conflitos</h2>
                    </div>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        O sistema possui uma lógica embutida para gerir conflitos de feriados. Não é necessário gastar um dia de férias adicional nas pontes contínuas que cobrem fins de semana e feriados (ex. Dia de Portugal ou o Natal calhado à semana ignoram as contabilizações úteis de dias retirados).
                    </p>
                    <p className="text-slate-700 leading-relaxed font-medium">
                        É da responsabilidade dos administradores vigiar sobreposições de férias da mesma equipa ou departamento usando os visuais práticos contidos no Calendário!
                    </p>
                </div>
            </div>

            <div className="text-center mt-12 pb-6">
                <p className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} NPED. Todos os direitos reservados. Criado por <a href="https://ice41.pt" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">ice41</a></p>
            </div>
        </div>
    );
}
