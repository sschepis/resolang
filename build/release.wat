(module
 (type $0 (func (param i32) (result i32)))
 (type $1 (func (param i32 i32) (result i32)))
 (type $2 (func (param i32)))
 (type $3 (func (param i32 i32 i32) (result i32)))
 (type $4 (func))
 (type $5 (func (param i32 i32)))
 (type $6 (func (param i32 i32 i32)))
 (type $7 (func (result i32)))
 (type $8 (func (param i32 i32) (result f64)))
 (type $9 (func (param i32) (result f64)))
 (type $10 (func (param i32 i32 i32 i32)))
 (type $11 (func (param f64 f64) (result f64)))
 (type $12 (func (param f64) (result i32)))
 (type $13 (func (param f64 i32 i32) (result i32)))
 (type $14 (func (param i32 i32 f64)))
 (type $15 (func (param i32 i32 i64)))
 (type $16 (func (param f64) (result f64)))
 (type $17 (func (param i64 i64 i32 i64 i32) (result i32)))
 (type $18 (func (param i32 f64 f64 f64) (result i32)))
 (type $19 (func (param f64 i32) (result i32)))
 (type $20 (func (param i32 f64)))
 (type $21 (func (param i32 f64) (result i32)))
 (import "env" "console.log" (func $~lib/bindings/dom/console.log (param i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (global $assembly/resonlang/currentNode (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/total (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/threshold (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/state (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/visitCount (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/pinSpace (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/iter (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/toSpace (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/white (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/fromSpace (mut i32) (i32.const 0))
 (global $~lib/rt/tlsf/ROOT (mut i32) (i32.const 0))
 (global $~lib/util/math/log_tail (mut f64) (f64.const 0))
 (global $~lib/util/number/_frc_plus (mut i64) (i64.const 0))
 (global $~lib/util/number/_frc_minus (mut i64) (i64.const 0))
 (global $~lib/util/number/_exp (mut i32) (i32.const 0))
 (global $~lib/util/number/_K (mut i32) (i32.const 0))
 (global $~lib/util/number/_frc_pow (mut i64) (i64.const 0))
 (global $~lib/util/number/_exp_pow (mut i32) (i32.const 0))
 (global $~lib/memory/__stack_pointer (mut i32) (i32.const 57116))
 (memory $0 1)
 (data $0 (i32.const 1036) "\9c")
 (data $0.1 (i32.const 1048) "\02\00\00\00\80\00\00\00-\00-\00-\00 \00R\00e\00s\00o\00L\00a\00n\00g\00 \00E\00x\00a\00m\00p\00l\00e\00 \00P\00r\00o\00g\00r\00a\00m\00 \00(\00I\00m\00p\00l\00e\00m\00e\00n\00t\00e\00d\00 \00i\00n\00 \00A\00s\00s\00e\00m\00b\00l\00y\00S\00c\00r\00i\00p\00t\00)\00 \00-\00-\00-")
 (data $1 (i32.const 1196) ",")
 (data $1.1 (i32.const 1208) "\02\00\00\00\1a\00\00\00t\00r\00u\00t\00h\00 \00p\00a\00t\00t\00e\00r\00n")
 (data $2 (i32.const 1244) "<")
 (data $2.1 (i32.const 1256) "\02\00\00\00(\00\00\00A\00l\00l\00o\00c\00a\00t\00i\00o\00n\00 \00t\00o\00o\00 \00l\00a\00r\00g\00e")
 (data $3 (i32.const 1308) "<")
 (data $3.1 (i32.const 1320) "\02\00\00\00 \00\00\00~\00l\00i\00b\00/\00r\00t\00/\00i\00t\00c\00m\00s\00.\00t\00s")
 (data $6 (i32.const 1436) "<")
 (data $6.1 (i32.const 1448) "\02\00\00\00$\00\00\00I\00n\00d\00e\00x\00 \00o\00u\00t\00 \00o\00f\00 \00r\00a\00n\00g\00e")
 (data $7 (i32.const 1500) ",")
 (data $7.1 (i32.const 1512) "\02\00\00\00\14\00\00\00~\00l\00i\00b\00/\00r\00t\00.\00t\00s")
 (data $9 (i32.const 1580) "<")
 (data $9.1 (i32.const 1592) "\02\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00t\00l\00s\00f\00.\00t\00s")
 (data $10 (i32.const 1644) ",")
 (data $10.1 (i32.const 1656) "\02\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h")
 (data $11 (i32.const 1692) "<")
 (data $11.1 (i32.const 1704) "\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s")
 (data $12 (i32.const 1760) "\9f\de\e0\c3\f04\f7?\00\90\e6y\7f\cc\d7\bf\1f\e9,jx\13\f7?\00\00\r\c2\eeo\d7\bf\a0\b5\fa\08`\f2\f6?\00\e0Q\13\e3\13\d7\bf}\8c\13\1f\a6\d1\f6?\00x(8[\b8\d6\bf\d1\b4\c5\0bI\b1\f6?\00x\80\90U]\d6\bf\ba\0c/3G\91\f6?\00\00\18v\d0\02\d6\bf#B\"\18\9fq\f6?\00\90\90\86\ca\a8\d5\bf\d9\1e\a5\99OR\f6?\00P\03VCO\d5\bf\c4$\8f\aaV3\f6?\00@k\c37\f6\d4\bf\14\dc\9dk\b3\14\f6?\00P\a8\fd\a7\9d\d4\bfL\\\c6Rd\f6\f5?\00\a8\899\92E\d4\bfO,\91\b5g\d8\f5?\00\b8\b09\f4\ed\d3\bf\de\90[\cb\bc\ba\f5?\00p\8fD\ce\96\d3\bfx\1a\d9\f2a\9d\f5?\00\a0\bd\17\1e@\d3\bf\87VF\12V\80\f5?\00\80F\ef\e2\e9\d2\bf\d3k\e7\ce\97c\f5?\00\e008\1b\94\d2\bf\93\7f\a7\e2%G\f5?\00\88\da\8c\c5>\d2\bf\83E\06B\ff*\f5?\00\90\')\e1\e9\d1\bf\df\bd\b2\db\"\0f\f5?\00\f8H+m\95\d1\bf\d7\de4G\8f\f3\f4?\00\f8\b9\9agA\d1\bf@(\de\cfC\d8\f4?\00\98\ef\94\d0\ed\d0\bf\c8\a3x\c0>\bd\f4?\00\10\db\18\a5\9a\d0\bf\8a%\e0\c3\7f\a2\f4?\00\b8cR\e6G\d0\bf4\84\d4$\05\88\f4?\00\f0\86E\"\eb\cf\bf\0b-\19\1b\cem\f4?\00\b0\17uJG\cf\bfT\189\d3\d9S\f4?\000\10=D\a4\ce\bfZ\84\b4D\':\f4?\00\b0\e9D\r\02\ce\bf\fb\f8\15A\b5 \f4?\00\f0w)\a2`\cd\bf\b1\f4>\da\82\07\f4?\00\90\95\04\01\c0\cc\bf\8f\feW]\8f\ee\f3?\00\10\89V) \cc\bf\e9L\0b\a0\d9\d5\f3?\00\10\81\8d\17\81\cb\bf+\c1\10\c0`\bd\f3?\00\d0\d3\cc\c9\e2\ca\bf\b8\dau+$\a5\f3?\00\90\12.@E\ca\bf\02\d0\9f\cd\"\8d\f3?\00\f0\1dhw\a8\c9\bf\1cz\84\c5[u\f3?\000Him\0c\c9\bf\e26\adI\ce]\f3?\00\c0E\a6 q\c8\bf@\d4M\98yF\f3?\000\14\b4\8f\d6\c7\bf$\cb\ff\ce\\/\f3?\00pb<\b8<\c7\bfI\r\a1uw\18\f3?\00`7\9b\9a\a3\c6\bf\909>7\c8\01\f3?\00\a0\b7T1\0b\c6\bfA\f8\95\bbN\eb\f2?\000$v}s\c5\bf\d1\a9\19\02\n\d5\f2?\000\c2\8f{\dc\c4\bf*\fd\b7\a8\f9\be\f2?\00\00\d2Q,F\c4\bf\ab\1b\0cz\1c\a9\f2?\00\00\83\bc\8a\b0\c3\bf0\b5\14`r\93\f2?\00\00Ik\99\1b\c3\bf\f5\a1WW\fa}\f2?\00@\a4\90T\87\c2\bf\bf;\1d\9b\b3h\f2?\00\a0y\f8\b9\f3\c1\bf\bd\f5\8f\83\9dS\f2?\00\a0,%\c8`\c1\bf;\08\c9\aa\b7>\f2?\00 \f7W\7f\ce\c0\bf\b6@\a9+\01*\f2?\00\a0\feI\dc<\c0\bf2A\cc\96y\15\f2?\00\80K\bc\bdW\bf\bf\9b\fc\d2\1d \01\f2?\00@@\96\087\be\bf\0bHMI\f4\ec\f1?\00@\f9>\98\17\bd\bfie\8fR\f5\d8\f1?\00\a0\d8Ng\f9\bb\bf|~W\11#\c5\f1?\00`/ y\dc\ba\bf\e9&\cbt|\b1\f1?\00\80(\e7\c3\c0\b9\bf\b6\1a,\0c\01\9e\f1?\00\c0r\b3F\a6\b8\bf\bdp\b6{\b0\8a\f1?\00\00\ac\b3\01\8d\b7\bf\b6\bc\ef%\8aw\f1?\00\008E\f1t\b6\bf\da1L5\8dd\f1?\00\80\87m\0e^\b5\bf\dd_\'\90\b9Q\f1?\00\e0\a1\de\\H\b4\bfL\d22\a4\0e?\f1?\00\a0jM\d93\b3\bf\da\f9\10r\8b,\f1?\00`\c5\f8y \b2\bf1\b5\ec(0\1a\f1?\00 b\98F\0e\b1\bf\af4\84\da\fb\07\f1?\00\00\d2jl\fa\af\bf\b3kN\0f\ee\f5\f0?\00@wJ\8d\da\ad\bf\ce\9f*]\06\e4\f0?\00\00\85\e4\ec\bc\ab\bf!\a5,cD\d2\f0?\00\c0\12@\89\a1\a9\bf\1a\98\e2|\a7\c0\f0?\00\c0\023X\88\a7\bf\d16\c6\83/\af\f0?\00\80\d6g^q\a5\bf9\13\a0\98\db\9d\f0?\00\80eI\8a\\\a3\bf\df\e7R\af\ab\8c\f0?\00@\15d\e3I\a1\bf\fb(N/\9f{\f0?\00\80\eb\82\c0r\9e\bf\19\8f5\8c\b5j\f0?\00\80RR\f1U\9a\bf,\f9\ec\a5\eeY\f0?\00\80\81\cfb=\96\bf\90,\d1\cdII\f0?\00\00\aa\8c\fb(\92\bf\a9\ad\f0\c6\c68\f0?\00\00\f9 {1\8c\bf\a92y\13e(\f0?\00\00\aa]5\19\84\bfHs\ea\'$\18\f0?\00\00\ec\c2\03\12x\bf\95\b1\14\06\04\08\f0?\00\00$y\t\04`\bf\1a\fa&\f7\1f\e0\ef?\00\00\90\84\f3\efo?t\eaa\c2\1c\a1\ef?\00\00=5A\dc\87?.\99\81\b0\10c\ef?\00\80\c2\c4\a3\ce\93?\cd\ad\ee<\f6%\ef?\00\00\89\14\c1\9f\9b?\e7\13\91\03\c8\e9\ee?\00\00\11\ce\d8\b0\a1?\ab\b1\cbx\80\ae\ee?\00\c0\01\d0[\8a\a5?\9b\0c\9d\a2\1at\ee?\00\80\d8@\83\\\a9?\b5\99\n\83\91:\ee?\00\80W\efj\'\ad?V\9a`\t\e0\01\ee?\00\c0\98\e5\98u\b0?\98\bbw\e5\01\ca\ed?\00 \r\e3\f5S\b2?\03\91|\0b\f2\92\ed?\00\008\8b\dd.\b4?\ce\\\fbf\ac\\\ed?\00\c0W\87Y\06\b6?\9d\de^\aa,\'\ed?\00\00j5v\da\b7?\cd,k>n\f2\ec?\00`\1cNC\ab\b9?\02y\a7\a2m\be\ec?\00`\r\bb\c7x\bb?m\087m&\8b\ec?\00 \e72\13C\bd?\04X]\bd\94X\ec?\00`\deq1\n\bf?\8c\9f\bb3\b5&\ec?\00@\91+\15g\c0??\e7\ec\ee\83\f5\eb?\00\b0\92\82\85G\c1?\c1\96\dbu\fd\c4\eb?\000\ca\cdn&\c2?(J\86\0c\1e\95\eb?\00P\c5\a6\d7\03\c3?,>\ef\c5\e2e\eb?\00\103<\c3\df\c3?\8b\88\c9gH7\eb?\00\80zk6\ba\c4?J0\1d!K\t\eb?\00\f0\d1(9\93\c5?~\ef\f2\85\e8\db\ea?\00\f0\18$\cdj\c6?\a2=`1\1d\af\ea?\00\90f\ec\f8@\c7?\a7X\d3?\e6\82\ea?\00\f0\1a\f5\c0\15\c8?\8bs\t\ef@W\ea?\00\80\f6T)\e9\c8?\'K\ab\90*,\ea?\00@\f8\026\bb\c9?\d1\f2\93\13\a0\01\ea?\00\00,\1c\ed\8b\ca?\1b<\db$\9f\d7\e9?\00\d0\01\\Q[\cb?\90\b1\c7\05%\ae\e9?\00\c0\bc\ccg)\cc?/\ce\97\f2.\85\e9?\00`H\d55\f6\cc?uK\a4\ee\ba\\\e9?\00\c0F4\bd\c1\cd?8H\e7\9d\c64\e9?\00\e0\cf\b8\01\8c\ce?\e6Rg/O\r\e9?\00\90\17\c0\tU\cf?\9d\d7\ff\8eR\e6\e8?\00\b8\1f\12l\0e\d0?|\00\cc\9f\ce\bf\e8?\00\d0\93\0e\b8q\d0?\0e\c3\be\da\c0\99\e8?\00p\86\9ek\d4\d0?\fb\17#\aa\'t\e8?\00\d0K3\876\d1?\08\9a\b3\ac\00O\e8?\00H#g\r\98\d1?U>e\e8I*\e8?\00\80\cc\e0\ff\f8\d1?`\02\f4\95\01\06\e8?\00hc\d7_Y\d2?)\a3\e0c%\e2\e7?\00\a8\14\t0\b9\d2?\ad\b5\dcw\b3\be\e7?\00`C\10r\18\d3?\c2%\97g\aa\9b\e7?\00\18\ecm&w\d3?W\06\17\f2\07y\e7?\000\af\fbO\d5\d3?\0c\13\d6\db\caV\e7?\00\e0/\e3\ee2\d4?")
 (data $13 (i32.const 3808) "k\b6O\01\00\10\e6?<[B\91l\02~<\95\b4M\03\000\e6?A]\00H\ea\bf\8d<x\d4\94\r\00P\e6?\b7\a5\d6\86\a7\7f\8e<\adoN\07\00p\e6?L%Tk\ea\fca<\ae\0f\df\fe\ff\8f\e6?\fd\0eYL\'~|\bc\bc\c5c\07\00\b0\e6?\01\da\dcHh\c1\8a\bc\f6\c1\\\1e\00\d0\e6?\11\93I\9d\1c?\83<>\f6\05\eb\ff\ef\e6?S-\e2\1a\04\80~\bc\80\97\86\0e\00\10\e7?Ry\tqf\ff{<\12\e9g\fc\ff/\e7?$\87\bd&\e2\00\8c<j\11\81\df\ffO\e7?\d2\01\f1n\91\02n\bc\90\9cg\0f\00p\e7?t\9cT\cdq\fcg\bc5\c8~\fa\ff\8f\e7?\83\04\f5\9e\c1\be\81<\e6\c2 \fe\ff\af\e7?ed\cc)\17~p\bc\00\c9?\ed\ff\cf\e7?\1c\8b{\08r\80\80\bcv\1a&\e9\ff\ef\e7?\ae\f9\9dm(\c0\8d<\e8\a3\9c\04\00\10\e8?3L\e5Q\d2\7f\89<\8f,\93\17\000\e8?\81\f30\b6\e9\fe\8a\bc\9cs3\06\00P\e8?\bc5ek\bf\bf\89<\c6\89B \00p\e8?u{\11\f3e\bf\8b\bc\04y\f5\eb\ff\8f\e8?W\cb=\a2n\00\89\bc\df\04\bc\"\00\b0\e8?\nK\e08\df\00}\bc\8a\1b\0c\e5\ff\cf\e8?\05\9f\ffFq\00\88\bcC\8e\91\fc\ff\ef\e8?8pz\d0{\81\83<\c7_\fa\1e\00\10\e9?\03\b4\dfv\91>\89<\b9{F\13\000\e9?v\02\98KN\80\7f<o\07\ee\e6\ffO\e9?.b\ff\d9\f0~\8f\bc\d1\12<\de\ffo\e9?\ba8&\96\aa\82p\bc\r\8aE\f4\ff\8f\e9?\ef\a8d\91\1b\80\87\bc>.\98\dd\ff\af\e9?7\93Z\8a\e0@\87\bcf\fbI\ed\ff\cf\e9?\00\e0\9b\c1\08\ce?<Q\9c\f1 \00\f0\e9?\n[\88\'\aa?\8a\bc\06\b0E\11\00\10\ea?V\daX\99H\fft<\fa\f6\bb\07\000\ea?\18m+\8a\ab\be\8c<y\1d\97\10\00P\ea?0yx\dd\ca\fe\88<H.\f5\1d\00p\ea?\db\ab\d8=vA\8f\bcR3Y\1c\00\90\ea?\12v\c2\84\02\bf\8e\bcK>O*\00\b0\ea?_?\ff<\04\fdi\bc\d1\1e\ae\d7\ff\cf\ea?\b4p\90\12\e7>\82\bcx\04Q\ee\ff\ef\ea?\a3\de\0e\e0>\06j<[\re\db\ff\0f\eb?\b9\n\1f8\c8\06Z<W\ca\aa\fe\ff/\eb?\1d<#t\1e\01y\bc\dc\ba\95\d9\ffO\eb?\9f*\86h\10\ffy\bc\9ce\9e$\00p\eb?>O\86\d0E\ff\8a<@\16\87\f9\ff\8f\eb?\f9\c3\c2\96w\fe|<O\cb\04\d2\ff\af\eb?\c4+\f2\ee\'\ffc\bcE\\A\d2\ff\cf\eb?!\ea;\ee\b7\ffl\bc\df\tc\f8\ff\ef\eb?\\\0b.\97\03A\81\bcSv\b5\e1\ff\0f\ec?\19j\b7\94d\c1\8b<\e3W\fa\f1\ff/\ec?\ed\c60\8d\ef\fed\bc$\e4\bf\dc\ffO\ec?uG\ec\bch?\84\bc\f7\b9T\ed\ffo\ec?\ec\e0S\f0\a3~\84<\d5\8f\99\eb\ff\8f\ec?\f1\92\f9\8d\06\83s<\9a!%!\00\b0\ec?\04\0e\18d\8e\fdh\bc\9cF\94\dd\ff\cf\ec?r\ea\c7\1c\be~\8e<v\c4\fd\ea\ff\ef\ec?\fe\88\9f\ad9\be\8e<+\f8\9a\16\00\10\ed?qZ\b9\a8\91}u<\1d\f7\0f\r\000\ed?\da\c7pi\90\c1\89<\c4\0fy\ea\ffO\ed?\0c\feX\c57\0eX\bc\e5\87\dc.\00p\ed?D\0f\c1M\d6\80\7f\bc\aa\82\dc!\00\90\ed?\\\\\fd\94\8f|t\bc\83\02k\d8\ff\af\ed?~a!\c5\1d\7f\8c<9Gl)\00\d0\ed?S\b1\ff\b2\9e\01\88<\f5\90D\e5\ff\ef\ed?\89\ccR\c6\d2\00n<\94\f6\ab\cd\ff\0f\ee?\d2i- @\83\7f\bc\dd\c8R\db\ff/\ee?d\08\1b\ca\c1\00{<\ef\16B\f2\ffO\ee?Q\ab\94\b0\a8\ffr<\11^\8a\e8\ffo\ee?Y\be\ef\b1s\f6W\bc\r\ff\9e\11\00\90\ee?\01\c8\0b^\8d\80\84\bcD\17\a5\df\ff\af\ee?\b5 C\d5\06\00x<\a1\7f\12\1a\00\d0\ee?\92\\V`\f8\02P\bc\c4\bc\ba\07\00\f0\ee?\11\e65]D@\85\bc\02\8dz\f5\ff\0f\ef?\05\91\ef91\fbO\bc\c7\8a\e5\1e\000\ef?U\11s\f2\ac\81\8a<\944\82\f5\ffO\ef?C\c7\d7\d4A?\8a<kL\a9\fc\ffo\ef?ux\98\1c\f4\02b\bcA\c4\f9\e1\ff\8f\ef?K\e7w\f4\d1}w<~\e3\e0\d2\ff\af\ef?1\a3|\9a\19\01o\bc\9e\e4w\1c\00\d0\ef?\b1\ac\ceK\ee\81q<1\c3\e0\f7\ff\ef\ef?Z\87p\017\05n\bcn`e\f4\ff\0f\f0?\da\n\1cI\ad~\8a\bcXz\86\f3\ff/\f0?\e0\b2\fc\c3i\7f\97\bc\17\r\fc\fd\ffO\f0?[\94\cb4\fe\bf\97<\82M\cd\03\00p\f0?\cbV\e4\c0\83\00\82<\e8\cb\f2\f9\ff\8f\f0?\1au7\be\df\ffm\bce\da\0c\01\00\b0\f0?\eb&\e6\ae\7f?\91\bc8\d3\a4\01\00\d0\f0?\f7\9fHy\fa}\80<\fd\fd\da\fa\ff\ef\f0?\c0k\d6p\05\04w\bc\96\fd\ba\0b\00\10\f1?b\0bm\84\d4\80\8e<]\f4\e5\fa\ff/\f1?\ef6\fdd\fa\bf\9d<\d9\9a\d5\r\00P\f1?\aeP\12pw\00\9a<\9aU!\0f\00p\f1?\ee\de\e3\e2\f9\fd\8d<&T\'\fc\ff\8f\f1?sr;\dc0\00\91<Y<=\12\00\b0\f1?\88\01\03\80y\7f\99<\b7\9e)\f8\ff\cf\f1?g\8c\9f\ab2\f9e\bc\00\d4\8a\f4\ff\ef\f1?\eb[\a7\9d\bf\7f\93<\a4\86\8b\0c\00\10\f2?\"[\fd\91k\80\9f<\03C\85\03\000\f2?3\bf\9f\eb\c2\ff\93<\84\f6\bc\ff\ffO\f2?r..~\e7\01v<\d9!)\f5\ffo\f2?a\0c\7fv\bb\fc\7f<<:\93\14\00\90\f2?+A\02<\ca\02r\bc\13cU\14\00\b0\f2?\02\1f\f23\82\80\92\bc;R\fe\eb\ff\cf\f2?\f2\dcO8~\ff\88\bc\96\ad\b8\0b\00\f0\f2?\c5A0PQ\ff\85\bc\af\e2z\fb\ff\0f\f3?\9d(^\88q\00\81\bc\7f_\ac\fe\ff/\f3?\15\b7\b7?]\ff\91\bcVg\a6\0c\00P\f3?\bd\82\8b\"\82\7f\95<!\f7\fb\11\00p\f3?\cc\d5\r\c4\ba\00\80<\b9/Y\f9\ff\8f\f3?Q\a7\b2-\9d?\94\bcB\d2\dd\04\00\b0\f3?\e18vpk\7f\85<W\c9\b2\f5\ff\cf\f3?1\12\bf\10:\02z<\18\b4\b0\ea\ff\ef\f3?\b0R\b1fm\7f\98<\f4\af2\15\00\10\f4?$\85\19_7\f8g<)\8bG\17\000\f4?CQ\dcr\e6\01\83<c\b4\95\e7\ffO\f4?Z\89\b2\b8i\ff\89<\e0u\04\e8\ffo\f4?T\f2\c2\9b\b1\c0\95\bc\e7\c1o\ef\ff\8f\f4?r*:\f2\t@\9b<\04\a7\be\e5\ff\af\f4?E}\r\bf\b7\ff\94\bc\de\'\10\17\00\d0\f4?=j\dcqd\c0\99\bc\e2>\f0\0f\00\f0\f4?\1cS\85\0b\89\7f\97<\d1K\dc\12\00\10\f5?6\a4fqe\04`<z\'\05\16\000\f5?\t2#\ce\ce\bf\96\bcLp\db\ec\ffO\f5?\d7\a1\05\05r\02\89\bc\a9T_\ef\ffo\f5?\12d\c9\0e\e6\bf\9b<\12\10\e6\17\00\90\f5?\90\ef\af\81\c5~\88<\92>\c9\03\00\b0\f5?\c0\0c\bf\n\08A\9f\bc\bc\19I\1d\00\d0\f5?)G%\fb*\81\98\bc\89z\b8\e7\ff\ef\f5?\04i\ed\80\b7~\94\bc")
 (data $14 (i32.const 5868) ",")
 (data $14.1 (i32.const 5880) "\02\00\00\00\1a\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00.\00t\00s")
 (data $15 (i32.const 5916) "L")
 (data $15.1 (i32.const 5928) "\02\00\00\008\00\00\00R\00e\00s\00o\00n\00a\00n\00t\00F\00r\00a\00g\00m\00e\00n\00t\00 \00{\00 \00e\00n\00t\00r\00o\00p\00y\00:\00 ")
 (data $16 (i32.const 5996) ",")
 (data $16.1 (i32.const 6008) "\02\00\00\00\16\00\00\00,\00 \00c\00e\00n\00t\00e\00r\00:\00 \00[")
 (data $17 (i32.const 6044) "\1c")
 (data $17.1 (i32.const 6056) "\02\00\00\00\04\00\00\00,\00 ")
 (data $18 (i32.const 6076) ",")
 (data $18.1 (i32.const 6088) "\02\00\00\00\1a\00\00\00]\00,\00 \00c\00o\00e\00f\00f\00s\00:\00 \00{\00 ")
 (data $19 (i32.const 6124) ",\00\00\00\03\00\00\00\00\00\00\00\0b\00\00\00\1c\00\00\000\17\00\00\00\00\00\00\80\17\00\00\00\00\00\00\b0\17\00\00\00\00\00\00\d0\17")
 (data $20 (i32.const 6181) "\a0\f6?")
 (data $20.1 (i32.const 6193) "\c8\b9\f2\82,\d6\bf\80V7($\b4\fa<\00\00\00\00\00\80\f6?")
 (data $20.2 (i32.const 6225) "\08X\bf\bd\d1\d5\bf \f7\e0\d8\08\a5\1c\bd\00\00\00\00\00`\f6?")
 (data $20.3 (i32.const 6257) "XE\17wv\d5\bfmP\b6\d5\a4b#\bd\00\00\00\00\00@\f6?")
 (data $20.4 (i32.const 6289) "\f8-\87\ad\1a\d5\bf\d5g\b0\9e\e4\84\e6\bc\00\00\00\00\00 \f6?")
 (data $20.5 (i32.const 6321) "xw\95_\be\d4\bf\e0>)\93i\1b\04\bd\00\00\00\00\00\00\f6?")
 (data $20.6 (i32.const 6353) "`\1c\c2\8ba\d4\bf\cc\84LH/\d8\13=\00\00\00\00\00\e0\f5?")
 (data $20.7 (i32.const 6385) "\a8\86\860\04\d4\bf:\0b\82\ed\f3B\dc<\00\00\00\00\00\c0\f5?")
 (data $20.8 (i32.const 6417) "HiUL\a6\d3\bf`\94Q\86\c6\b1 =\00\00\00\00\00\a0\f5?")
 (data $20.9 (i32.const 6449) "\80\98\9a\ddG\d3\bf\92\80\c5\d4MY%=\00\00\00\00\00\80\f5?")
 (data $20.10 (i32.const 6481) " \e1\ba\e2\e8\d2\bf\d8+\b7\99\1e{&=\00\00\00\00\00`\f5?")
 (data $20.11 (i32.const 6513) "\88\de\13Z\89\d2\bf?\b0\cf\b6\14\ca\15=\00\00\00\00\00`\f5?")
 (data $20.12 (i32.const 6545) "\88\de\13Z\89\d2\bf?\b0\cf\b6\14\ca\15=\00\00\00\00\00@\f5?")
 (data $20.13 (i32.const 6577) "x\cf\fbA)\d2\bfv\daS($Z\16\bd\00\00\00\00\00 \f5?")
 (data $20.14 (i32.const 6609) "\98i\c1\98\c8\d1\bf\04T\e7h\bc\af\1f\bd\00\00\00\00\00\00\f5?")
 (data $20.15 (i32.const 6641) "\a8\ab\ab\\g\d1\bf\f0\a8\823\c6\1f\1f=\00\00\00\00\00\e0\f4?")
 (data $20.16 (i32.const 6673) "H\ae\f9\8b\05\d1\bffZ\05\fd\c4\a8&\bd\00\00\00\00\00\c0\f4?")
 (data $20.17 (i32.const 6705) "\90s\e2$\a3\d0\bf\0e\03\f4~\eek\0c\bd\00\00\00\00\00\a0\f4?")
 (data $20.18 (i32.const 6737) "\d0\b4\94%@\d0\bf\7f-\f4\9e\b86\f0\bc\00\00\00\00\00\a0\f4?")
 (data $20.19 (i32.const 6769) "\d0\b4\94%@\d0\bf\7f-\f4\9e\b86\f0\bc\00\00\00\00\00\80\f4?")
 (data $20.20 (i32.const 6801) "@^m\18\b9\cf\bf\87<\99\ab*W\r=\00\00\00\00\00`\f4?")
 (data $20.21 (i32.const 6833) "`\dc\cb\ad\f0\ce\bf$\af\86\9c\b7&+=\00\00\00\00\00@\f4?")
 (data $20.22 (i32.const 6865) "\f0*n\07\'\ce\bf\10\ff?TO/\17\bd\00\00\00\00\00 \f4?")
 (data $20.23 (i32.const 6897) "\c0Ok!\\\cd\bf\1bh\ca\bb\91\ba!=\00\00\00\00\00\00\f4?")
 (data $20.24 (i32.const 6929) "\a0\9a\c7\f7\8f\cc\bf4\84\9fhOy\'=\00\00\00\00\00\00\f4?")
 (data $20.25 (i32.const 6961) "\a0\9a\c7\f7\8f\cc\bf4\84\9fhOy\'=\00\00\00\00\00\e0\f3?")
 (data $20.26 (i32.const 6993) "\90-t\86\c2\cb\bf\8f\b7\8b1\b0N\19=\00\00\00\00\00\c0\f3?")
 (data $20.27 (i32.const 7025) "\c0\80N\c9\f3\ca\bff\90\cd?cN\ba<\00\00\00\00\00\a0\f3?")
 (data $20.28 (i32.const 7057) "\b0\e2\1f\bc#\ca\bf\ea\c1F\dcd\8c%\bd\00\00\00\00\00\a0\f3?")
 (data $20.29 (i32.const 7089) "\b0\e2\1f\bc#\ca\bf\ea\c1F\dcd\8c%\bd\00\00\00\00\00\80\f3?")
 (data $20.30 (i32.const 7121) "P\f4\9cZR\c9\bf\e3\d4\c1\04\d9\d1*\bd\00\00\00\00\00`\f3?")
 (data $20.31 (i32.const 7153) "\d0 e\a0\7f\c8\bf\t\fa\db\7f\bf\bd+=\00\00\00\00\00@\f3?")
 (data $20.32 (i32.const 7185) "\e0\10\02\89\ab\c7\bfXJSr\90\db+=\00\00\00\00\00@\f3?")
 (data $20.33 (i32.const 7217) "\e0\10\02\89\ab\c7\bfXJSr\90\db+=\00\00\00\00\00 \f3?")
 (data $20.34 (i32.const 7249) "\d0\19\e7\0f\d6\c6\bff\e2\b2\a3j\e4\10\bd\00\00\00\00\00\00\f3?")
 (data $20.35 (i32.const 7281) "\90\a7p0\ff\c5\bf9P\10\9fC\9e\1e\bd\00\00\00\00\00\00\f3?")
 (data $20.36 (i32.const 7313) "\90\a7p0\ff\c5\bf9P\10\9fC\9e\1e\bd\00\00\00\00\00\e0\f2?")
 (data $20.37 (i32.const 7345) "\b0\a1\e3\e5&\c5\bf\8f[\07\90\8b\de \bd\00\00\00\00\00\c0\f2?")
 (data $20.38 (i32.const 7377) "\80\cbl+M\c4\bf<x5a\c1\0c\17=\00\00\00\00\00\c0\f2?")
 (data $20.39 (i32.const 7409) "\80\cbl+M\c4\bf<x5a\c1\0c\17=\00\00\00\00\00\a0\f2?")
 (data $20.40 (i32.const 7441) "\90\1e \fcq\c3\bf:T\'M\86x\f1<\00\00\00\00\00\80\f2?")
 (data $20.41 (i32.const 7473) "\f0\1f\f8R\95\c2\bf\08\c4q\170\8d$\bd\00\00\00\00\00`\f2?")
 (data $20.42 (i32.const 7505) "`/\d5*\b7\c1\bf\96\a3\11\18\a4\80.\bd\00\00\00\00\00`\f2?")
 (data $20.43 (i32.const 7537) "`/\d5*\b7\c1\bf\96\a3\11\18\a4\80.\bd\00\00\00\00\00@\f2?")
 (data $20.44 (i32.const 7569) "\90\d0|~\d7\c0\bf\f4[\e8\88\96i\n=\00\00\00\00\00@\f2?")
 (data $20.45 (i32.const 7601) "\90\d0|~\d7\c0\bf\f4[\e8\88\96i\n=\00\00\00\00\00 \f2?")
 (data $20.46 (i32.const 7633) "\e0\db1\91\ec\bf\bf\f23\a3\\Tu%\bd\00\00\00\00\00\00\f2?")
 (data $20.47 (i32.const 7666) "+n\07\'\be\bf<\00\f0*,4*=\00\00\00\00\00\00\f2?")
 (data $20.48 (i32.const 7698) "+n\07\'\be\bf<\00\f0*,4*=\00\00\00\00\00\e0\f1?")
 (data $20.49 (i32.const 7729) "\c0[\8fT^\bc\bf\06\be_XW\0c\1d\bd\00\00\00\00\00\c0\f1?")
 (data $20.50 (i32.const 7761) "\e0J:m\92\ba\bf\c8\aa[\e859%=\00\00\00\00\00\c0\f1?")
 (data $20.51 (i32.const 7793) "\e0J:m\92\ba\bf\c8\aa[\e859%=\00\00\00\00\00\a0\f1?")
 (data $20.52 (i32.const 7825) "\a01\d6E\c3\b8\bfhV/M)|\13=\00\00\00\00\00\a0\f1?")
 (data $20.53 (i32.const 7857) "\a01\d6E\c3\b8\bfhV/M)|\13=\00\00\00\00\00\80\f1?")
 (data $20.54 (i32.const 7889) "`\e5\8a\d2\f0\b6\bf\das3\c97\97&\bd\00\00\00\00\00`\f1?")
 (data $20.55 (i32.const 7921) " \06?\07\1b\b5\bfW^\c6a[\02\1f=\00\00\00\00\00`\f1?")
 (data $20.56 (i32.const 7953) " \06?\07\1b\b5\bfW^\c6a[\02\1f=\00\00\00\00\00@\f1?")
 (data $20.57 (i32.const 7985) "\e0\1b\96\d7A\b3\bf\df\13\f9\cc\da^,=\00\00\00\00\00@\f1?")
 (data $20.58 (i32.const 8017) "\e0\1b\96\d7A\b3\bf\df\13\f9\cc\da^,=\00\00\00\00\00 \f1?")
 (data $20.59 (i32.const 8049) "\80\a3\ee6e\b1\bf\t\a3\8fv^|\14=\00\00\00\00\00\00\f1?")
 (data $20.60 (i32.const 8081) "\80\11\c00\n\af\bf\91\8e6\83\9eY-=\00\00\00\00\00\00\f1?")
 (data $20.61 (i32.const 8113) "\80\11\c00\n\af\bf\91\8e6\83\9eY-=\00\00\00\00\00\e0\f0?")
 (data $20.62 (i32.const 8145) "\80\19q\ddB\ab\bfLp\d6\e5z\82\1c=\00\00\00\00\00\e0\f0?")
 (data $20.63 (i32.const 8177) "\80\19q\ddB\ab\bfLp\d6\e5z\82\1c=\00\00\00\00\00\c0\f0?")
 (data $20.64 (i32.const 8209) "\c02\f6Xt\a7\bf\ee\a1\f24F\fc,\bd\00\00\00\00\00\c0\f0?")
 (data $20.65 (i32.const 8241) "\c02\f6Xt\a7\bf\ee\a1\f24F\fc,\bd\00\00\00\00\00\a0\f0?")
 (data $20.66 (i32.const 8273) "\c0\fe\b9\87\9e\a3\bf\aa\fe&\f5\b7\02\f5<\00\00\00\00\00\a0\f0?")
 (data $20.67 (i32.const 8305) "\c0\fe\b9\87\9e\a3\bf\aa\fe&\f5\b7\02\f5<\00\00\00\00\00\80\f0?")
 (data $20.68 (i32.const 8338) "x\0e\9b\82\9f\bf\e4\t~|&\80)\bd\00\00\00\00\00\80\f0?")
 (data $20.69 (i32.const 8370) "x\0e\9b\82\9f\bf\e4\t~|&\80)\bd\00\00\00\00\00`\f0?")
 (data $20.70 (i32.const 8401) "\80\d5\07\1b\b9\97\bf9\a6\fa\93T\8d(\bd\00\00\00\00\00@\f0?")
 (data $20.71 (i32.const 8434) "\fc\b0\a8\c0\8f\bf\9c\a6\d3\f6|\1e\df\bc\00\00\00\00\00@\f0?")
 (data $20.72 (i32.const 8466) "\fc\b0\a8\c0\8f\bf\9c\a6\d3\f6|\1e\df\bc\00\00\00\00\00 \f0?")
 (data $20.73 (i32.const 8498) "\10k*\e0\7f\bf\e4@\da\r?\e2\19\bd\00\00\00\00\00 \f0?")
 (data $20.74 (i32.const 8530) "\10k*\e0\7f\bf\e4@\da\r?\e2\19\bd\00\00\00\00\00\00\f0?")
 (data $20.75 (i32.const 8582) "\f0?")
 (data $20.76 (i32.const 8613) "\c0\ef?")
 (data $20.77 (i32.const 8626) "\89u\15\10\80?\e8+\9d\99k\c7\10\bd\00\00\00\00\00\80\ef?")
 (data $20.78 (i32.const 8657) "\80\93XV \90?\d2\f7\e2\06[\dc#\bd\00\00\00\00\00@\ef?")
 (data $20.79 (i32.const 8690) "\c9(%I\98?4\0cZ2\ba\a0*\bd\00\00\00\00\00\00\ef?")
 (data $20.80 (i32.const 8721) "@\e7\89]A\a0?S\d7\f1\\\c0\11\01=\00\00\00\00\00\c0\ee?")
 (data $20.81 (i32.const 8754) ".\d4\aef\a4?(\fd\bdus\16,\bd\00\00\00\00\00\80\ee?")
 (data $20.82 (i32.const 8785) "\c0\9f\14\aa\94\a8?}&Z\d0\95y\19\bd\00\00\00\00\00@\ee?")
 (data $20.83 (i32.const 8817) "\c0\dd\cds\cb\ac?\07(\d8G\f2h\1a\bd\00\00\00\00\00 \ee?")
 (data $20.84 (i32.const 8849) "\c0\06\c01\ea\ae?{;\c9O>\11\0e\bd\00\00\00\00\00\e0\ed?")
 (data $20.85 (i32.const 8881) "`F\d1;\97\b1?\9b\9e\rV]2%\bd\00\00\00\00\00\a0\ed?")
 (data $20.86 (i32.const 8913) "\e0\d1\a7\f5\bd\b3?\d7N\db\a5^\c8,=\00\00\00\00\00`\ed?")
 (data $20.87 (i32.const 8945) "\a0\97MZ\e9\b5?\1e\1d]<\06i,\bd\00\00\00\00\00@\ed?")
 (data $20.88 (i32.const 8977) "\c0\ea\n\d3\00\b7?2\ed\9d\a9\8d\1e\ec<\00\00\00\00\00\00\ed?")
 (data $20.89 (i32.const 9009) "@Y]^3\b9?\daG\bd:\\\11#=\00\00\00\00\00\c0\ec?")
 (data $20.90 (i32.const 9041) "`\ad\8d\c8j\bb?\e5h\f7+\80\90\13\bd\00\00\00\00\00\a0\ec?")
 (data $20.91 (i32.const 9073) "@\bc\01X\88\bc?\d3\acZ\c6\d1F&=\00\00\00\00\00`\ec?")
 (data $20.92 (i32.const 9105) " \n\839\c7\be?\e0E\e6\afh\c0-\bd\00\00\00\00\00@\ec?")
 (data $20.93 (i32.const 9137) "\e0\db9\91\e8\bf?\fd\n\a1O\d64%\bd\00\00\00\00\00\00\ec?")
 (data $20.94 (i32.const 9169) "\e0\'\82\8e\17\c1?\f2\07-\cex\ef!=\00\00\00\00\00\e0\eb?")
 (data $20.95 (i32.const 9201) "\f0#~+\aa\c1?4\998D\8e\a7,=\00\00\00\00\00\a0\eb?")
 (data $20.96 (i32.const 9233) "\80\86\0ca\d1\c2?\a1\b4\81\cbl\9d\03=\00\00\00\00\00\80\eb?")
 (data $20.97 (i32.const 9265) "\90\15\b0\fce\c3?\89rK#\a8/\c6<\00\00\00\00\00@\eb?")
 (data $20.98 (i32.const 9297) "\b03\83=\91\c4?x\b6\fdTy\83%=\00\00\00\00\00 \eb?")
 (data $20.99 (i32.const 9329) "\b0\a1\e4\e5\'\c5?\c7}i\e5\e83&=\00\00\00\00\00\e0\ea?")
 (data $20.100 (i32.const 9361) "\10\8c\beNW\c6?x.<,\8b\cf\19=\00\00\00\00\00\c0\ea?")
 (data $20.101 (i32.const 9393) "pu\8b\12\f0\c6?\e1!\9c\e5\8d\11%\bd\00\00\00\00\00\a0\ea?")
 (data $20.102 (i32.const 9425) "PD\85\8d\89\c7?\05C\91p\10f\1c\bd\00\00\00\00\00`\ea?")
 (data $20.103 (i32.const 9458) "9\eb\af\be\c8?\d1,\e9\aaT=\07\bd\00\00\00\00\00@\ea?")
 (data $20.104 (i32.const 9490) "\f7\dcZZ\c9?o\ff\a0X(\f2\07=\00\00\00\00\00\00\ea?")
 (data $20.105 (i32.const 9521) "\e0\8a<\ed\93\ca?i!VPCr(\bd\00\00\00\00\00\e0\e9?")
 (data $20.106 (i32.const 9553) "\d0[W\d81\cb?\aa\e1\acN\8d5\0c\bd\00\00\00\00\00\c0\e9?")
 (data $20.107 (i32.const 9585) "\e0;8\87\d0\cb?\b6\12TY\c4K-\bd\00\00\00\00\00\a0\e9?")
 (data $20.108 (i32.const 9617) "\10\f0\c6\fbo\cc?\d2+\96\c5r\ec\f1\bc\00\00\00\00\00`\e9?")
 (data $20.109 (i32.const 9649) "\90\d4\b0=\b1\cd?5\b0\15\f7*\ff*\bd\00\00\00\00\00@\e9?")
 (data $20.110 (i32.const 9681) "\10\e7\ff\0eS\ce?0\f4A`\'\12\c2<\00\00\00\00\00 \e9?")
 (data $20.111 (i32.const 9714) "\dd\e4\ad\f5\ce?\11\8e\bbe\15!\ca\bc\00\00\00\00\00\00\e9?")
 (data $20.112 (i32.const 9745) "\b0\b3l\1c\99\cf?0\df\0c\ca\ec\cb\1b=\00\00\00\00\00\c0\e8?")
 (data $20.113 (i32.const 9777) "XM`8q\d0?\91N\ed\16\db\9c\f8<\00\00\00\00\00\a0\e8?")
 (data $20.114 (i32.const 9809) "`ag-\c4\d0?\e9\ea<\16\8b\18\'=\00\00\00\00\00\80\e8?")
 (data $20.115 (i32.const 9841) "\e8\'\82\8e\17\d1?\1c\f0\a5c\0e!,\bd\00\00\00\00\00`\e8?")
 (data $20.116 (i32.const 9873) "\f8\ac\cb\\k\d1?\81\16\a5\f7\cd\9a+=\00\00\00\00\00@\e8?")
 (data $20.117 (i32.const 9905) "hZc\99\bf\d1?\b7\bdGQ\ed\a6,=\00\00\00\00\00 \e8?")
 (data $20.118 (i32.const 9937) "\b8\0emE\14\d2?\ea\baF\ba\de\87\n=\00\00\00\00\00\e0\e7?")
 (data $20.119 (i32.const 9969) "\90\dc|\f0\be\d2?\f4\04PJ\fa\9c*=\00\00\00\00\00\c0\e7?")
 (data $20.120 (i32.const 10001) "`\d3\e1\f1\14\d3?\b8<!\d3z\e2(\bd\00\00\00\00\00\a0\e7?")
 (data $20.121 (i32.const 10033) "\10\bevgk\d3?\c8w\f1\b0\cdn\11=\00\00\00\00\00\80\e7?")
 (data $20.122 (i32.const 10065) "03wR\c2\d3?\\\bd\06\b6T;\18=\00\00\00\00\00`\e7?")
 (data $20.123 (i32.const 10097) "\e8\d5#\b4\19\d4?\9d\e0\90\ec6\e4\08=\00\00\00\00\00@\e7?")
 (data $20.124 (i32.const 10129) "\c8q\c2\8dq\d4?u\d6g\t\ce\'/\bd\00\00\00\00\00 \e7?")
 (data $20.125 (i32.const 10161) "0\17\9e\e0\c9\d4?\a4\d8\n\1b\89 .\bd\00\00\00\00\00\00\e7?")
 (data $20.126 (i32.const 10193) "\a08\07\ae\"\d5?Y\c7d\81p\be.=\00\00\00\00\00\e0\e6?")
 (data $20.127 (i32.const 10225) "\d0\c8S\f7{\d5?\ef@]\ee\ed\ad\1f=\00\00\00\00\00\c0\e6?")
 (data $20.128 (i32.const 10257) "`Y\df\bd\d5\d5?\dce\a4\08*\0b\n\bd")
 (data $21 (i32.const 10286) "\f0?n\bf\88\1aO;\9b<53\fb\a9=\f6\ef?]\dc\d8\9c\13`q\bca\80w>\9a\ec\ef?\d1f\87\10z^\90\bc\85\7fn\e8\15\e3\ef?\13\f6g5R\d2\8c<t\85\15\d3\b0\d9\ef?\fa\8e\f9#\80\ce\8b\bc\de\f6\dd)k\d0\ef?a\c8\e6aN\f7`<\c8\9bu\18E\c7\ef?\99\d33[\e4\a3\90<\83\f3\c6\ca>\be\ef?m{\83]\a6\9a\97<\0f\89\f9lX\b5\ef?\fc\ef\fd\92\1a\b5\8e<\f7Gr+\92\ac\ef?\d1\9c/p=\be><\a2\d1\d32\ec\a3\ef?\0bn\90\894\03j\bc\1b\d3\fe\aff\9b\ef?\0e\bd/*RV\95\bcQ[\12\d0\01\93\ef?U\eaN\8c\ef\80P\bc\cc1l\c0\bd\8a\ef?\16\f4\d5\b9#\c9\91\bc\e0-\a9\ae\9a\82\ef?\afU\\\e9\e3\d3\80<Q\8e\a5\c8\98z\ef?H\93\a5\ea\15\1b\80\bc{Q}<\b8r\ef?=2\deU\f0\1f\8f\bc\ea\8d\8c8\f9j\ef?\bfS\13?\8c\89\8b<u\cbo\eb[c\ef?&\eb\11v\9c\d9\96\bc\d4\\\04\84\e0[\ef?`/:>\f7\ec\9a<\aa\b9h1\87T\ef?\9d8\86\cb\82\e7\8f\bc\1d\d9\fc\"PM\ef?\8d\c3\a6DAo\8a<\d6\8cb\88;F\ef?}\04\e4\b0\05z\80<\96\dc}\91I?\ef?\94\a8\a8\e3\fd\8e\96<8bunz8\ef?}Ht\f2\18^\87<?\a6\b2O\ce1\ef?\f2\e7\1f\98+G\80<\dd|\e2eE+\ef?^\08q?{\b8\96\bc\81c\f5\e1\df$\ef?1\ab\tm\e1\f7\82<\e1\de\1f\f5\9d\1e\ef?\fa\bfo\1a\9b!=\bc\90\d9\da\d0\7f\18\ef?\b4\n\0cr\827\8b<\0b\03\e4\a6\85\12\ef?\8f\cb\ce\89\92\14n<V/>\a9\af\0c\ef?\b6\ab\b0MuM\83<\15\b71\n\fe\06\ef?Lt\ac\e2\01B\86<1\d8L\fcp\01\ef?J\f8\d3]9\dd\8f<\ff\16d\b2\08\fc\ee?\04[\8e;\80\a3\86\bc\f1\9f\92_\c5\f6\ee?hPK\cc\edJ\92\bc\cb\a9:7\a7\f1\ee?\8e-Q\1b\f8\07\99\bcf\d8\05m\ae\ec\ee?\d26\94>\e8\d1q\bc\f7\9f\e54\db\e7\ee?\15\1b\ce\b3\19\19\99\bc\e5\a8\13\c3-\e3\ee?mL*\a7H\9f\85<\"4\12L\a6\de\ee?\8ai(z`\12\93\bc\1c\80\ac\04E\da\ee?[\89\17H\8f\a7X\bc*.\f7!\n\d6\ee?\1b\9aIg\9b,|\bc\97\a8P\d9\f5\d1\ee?\11\ac\c2`\edcC<-\89a`\08\ce\ee?\efd\06;\tf\96<W\00\1d\edA\ca\ee?y\03\a1\da\e1\ccn<\d0<\c1\b5\a2\c6\ee?0\12\0f?\8e\ff\93<\de\d3\d7\f0*\c3\ee?\b0\afz\bb\ce\90v<\'*6\d5\da\bf\ee?w\e0T\eb\bd\1d\93<\r\dd\fd\99\b2\bc\ee?\8e\a3q\004\94\8f\bc\a7,\9dv\b2\b9\ee?I\a3\93\dc\cc\de\87\bcBf\cf\a2\da\b6\ee?_8\0f\bd\c6\dex\bc\82O\9dV+\b4\ee?\f6\\{\ecF\12\86\bc\0f\92]\ca\a4\b1\ee?\8e\d7\fd\18\055\93<\da\'\b56G\af\ee?\05\9b\8a/\b7\98{<\fd\c7\97\d4\12\ad\ee?\tT\1c\e2\e1c\90<)TH\dd\07\ab\ee?\ea\c6\19P\85\c74<\b7FY\8a&\a9\ee?5\c0d+\e62\94<H!\ad\15o\a7\ee?\9fv\99aJ\e4\8c\bc\t\dcv\b9\e1\a5\ee?\a8M\ef;\c53\8c\bc\85U:\b0~\a4\ee?\ae\e9+\89xS\84\bc \c3\cc4F\a3\ee?XXVx\dd\ce\93\bc%\"U\828\a2\ee?d\19~\80\aa\10W<s\a9L\d4U\a1\ee?(\"^\bf\ef\b3\93\bc\cd;\7ff\9e\a0\ee?\82\b94\87\ad\12j\bc\bf\da\0bu\12\a0\ee?\ee\a9m\b8\efgc\bc/\1ae<\b2\9f\ee?Q\88\e0T=\dc\80\bc\84\94Q\f9}\9f\ee?\cf>Z~d\1fx\bct_\ec\e8u\9f\ee?\b0}\8b\c0J\ee\86\bct\81\a5H\9a\9f\ee?\8a\e6U\1e2\19\86\bc\c9gBV\eb\9f\ee?\d3\d4\t^\cb\9c\90<?]\deOi\a0\ee?\1d\a5M\b9\dc2{\bc\87\01\ebs\14\a1\ee?k\c0gT\fd\ec\94<2\c10\01\ed\a1\ee?Ul\d6\ab\e1\ebe<bN\cf6\f3\a2\ee?B\cf\b3/\c5\a1\88\bc\12\1a>T\'\a4\ee?47;\f1\b6i\93\bc\13\ceL\99\89\a5\ee?\1e\ff\19:\84^\80\bc\ad\c7#F\1a\a7\ee?nWr\d8P\d4\94\bc\ed\92D\9b\d9\a8\ee?\00\8a\0e[g\ad\90<\99f\8a\d9\c7\aa\ee?\b4\ea\f0\c1/\b7\8d<\db\a0*B\e5\ac\ee?\ff\e7\c5\9c`\b6e\bc\8cD\b5\162\af\ee?D_\f3Y\83\f6{<6w\15\99\ae\b1\ee?\83=\1e\a7\1f\t\93\bc\c6\ff\91\0b[\b4\ee?)\1el\8b\b8\a9]\bc\e5\c5\cd\b07\b7\ee?Y\b9\90|\f9#l\bc\0fR\c8\cbD\ba\ee?\aa\f9\f4\"CC\92\bcPN\de\9f\82\bd\ee?K\8ef\d7l\ca\85\bc\ba\07\cap\f1\c0\ee?\'\ce\91+\fc\afq<\90\f0\a3\82\91\c4\ee?\bbs\n\e15\d2m<##\e3\19c\c8\ee?c\"b\"\04\c5\87\bce\e5]{f\cc\ee?\d51\e2\e3\86\1c\8b<3-J\ec\9b\d0\ee?\15\bb\bc\d3\d1\bb\91\bc]%>\b2\03\d5\ee?\d21\ee\9c1\cc\90<X\b30\13\9e\d9\ee?\b3Zsn\84i\84<\bf\fdyUk\de\ee?\b4\9d\8e\97\cd\df\82\bcz\f3\d3\bfk\e3\ee?\873\cb\92w\1a\8c<\ad\d3Z\99\9f\e8\ee?\fa\d9\d1J\8f{\90\bcf\b6\8d)\07\ee\ee?\ba\ae\dcV\d9\c3U\bc\fb\15O\b8\a2\f3\ee?@\f6\a6=\0e\a4\90\bc:Y\e5\8dr\f9\ee?4\93\ad8\f4\d6h\bcG^\fb\f2v\ff\ee?5\8aXk\e2\ee\91\bcJ\06\a10\b0\05\ef?\cd\dd_\n\d7\fft<\d2\c1K\90\1e\0c\ef?\ac\98\92\fa\fb\bd\91\bc\t\1e\d7[\c2\12\ef?\b3\0c\af0\aens<\9cR\85\dd\9b\19\ef?\94\fd\9f\\2\e3\8e<z\d0\ff_\ab \ef?\acY\t\d1\8f\e0\84<K\d1W.\f1\'\ef?g\1aN8\af\cdc<\b5\e7\06\94m/\ef?h\19\92l,kg<i\90\ef\dc 7\ef?\d2\b5\cc\83\18\8a\80\bc\fa\c3]U\0b?\ef?o\fa\ff?]\ad\8f\bc|\89\07J-G\ef?I\a9u8\ae\r\90\bc\f2\89\r\08\87O\ef?\a7\07=\a6\85\a3t<\87\a4\fb\dc\18X\ef?\0f\"@ \9e\91\82\bc\98\83\c9\16\e3`\ef?\ac\92\c1\d5PZ\8e<\852\db\03\e6i\ef?Kk\01\acY:\84<`\b4\01\f3!s\ef?\1f>\b4\07!\d5\82\bc_\9b{3\97|\ef?\c9\rG;\b9*\89\bc)\a1\f5\14F\86\ef?\d3\88:`\04\b6t<\f6?\8b\e7.\90\ef?qr\9dQ\ec\c5\83<\83L\c7\fbQ\9a\ef?\f0\91\d3\8f\12\f7\8f\bc\da\90\a4\a2\af\a4\ef?}t#\e2\98\ae\8d\bc\f1g\8e-H\af\ef?\08 \aaA\bc\c3\8e<\'Za\ee\1b\ba\ef?2\eb\a9\c3\94+\84<\97\bak7+\c5\ef?\ee\85\d11\a9d\8a<@En[v\d0\ef?\ed\e3;\e4\ba7\8e\bc\14\be\9c\ad\fd\db\ef?\9d\cd\91M;\89w<\d8\90\9e\81\c1\e7\ef?\89\cc`A\c1\05S<\f1q\8f+\c2\f3\ef?")
 (data $22 (i32.const 12332) "\1c")
 (data $22.1 (i32.const 12344) "\02\00\00\00\06\00\00\000\00.\000")
 (data $23 (i32.const 12364) "\1c")
 (data $23.1 (i32.const 12376) "\02\00\00\00\06\00\00\00N\00a\00N")
 (data $24 (i32.const 12396) ",")
 (data $24.1 (i32.const 12408) "\02\00\00\00\12\00\00\00-\00I\00n\00f\00i\00n\00i\00t\00y")
 (data $25 (i32.const 12444) ",")
 (data $25.1 (i32.const 12456) "\02\00\00\00\10\00\00\00I\00n\00f\00i\00n\00i\00t\00y")
 (data $27 (i32.const 12552) "\88\02\1c\08\a0\d5\8f\fav\bf>\a2\7f\e1\ae\bav\acU0 \fb\16\8b\ea5\ce]J\89B\cf-;eU\aa\b0k\9a\dfE\1a=\03\cf\1a\e6\ca\c6\9a\c7\17\fep\abO\dc\bc\be\fc\b1w\ff\0c\d6kA\ef\91V\be<\fc\7f\90\ad\1f\d0\8d\83\9aU1(\\Q\d3\b5\c9\a6\ad\8f\acq\9d\cb\8b\ee#w\"\9c\eamSx@\91I\cc\aeW\ce\b6]y\12<\827V\fbM6\94\10\c2O\98H8o\ea\96\90\c7:\82%\cb\85t\d7\f4\97\bf\97\cd\cf\86\a0\e5\ac*\17\98\n4\ef\8e\b25*\fbg8\b2;?\c6\d2\df\d4\c8\84\ba\cd\d3\1a\'D\dd\c5\96\c9%\bb\ce\9fk\93\84\a5b}$l\ac\db\f6\da_\rXf\ab\a3&\f1\c3\de\93\f8\e2\f3\b8\80\ff\aa\a8\ad\b5\b5\8bJ|l\05_b\87S0\c14`\ff\bc\c9U&\ba\91\8c\85N\96\bd~)p$w\f9\df\8f\b8\e5\b8\9f\bd\df\a6\94}t\88\cf_\a9\f8\cf\9b\a8\8f\93pD\b9k\15\0f\bf\f8\f0\08\8a\b611eU%\b0\cd\ac\7f{\d0\c6\e2?\99\06;+*\c4\10\\\e4\d3\92si\99$$\aa\0e\ca\00\83\f2\b5\87\fd\eb\1a\11\92d\08\e5\bc\cc\88Po\t\cc\bc\8c,e\19\e2X\17\b7\d1\00\00\00\00\00\00@\9c\00\00\00\00\10\a5\d4\e8\00\00b\ac\c5\ebx\ad\84\t\94\f8x9?\81\b3\15\07\c9{\ce\97\c0p\\\ea{\ce2~\8fh\80\e9\ab\a48\d2\d5E\"\9a\17&\'O\9f\'\fb\c4\d41\a2c\ed\a8\ad\c8\8c8e\de\b0\dbe\ab\1a\8e\08\c7\83\9a\1dqB\f9\1d]\c4X\e7\1b\a6,iM\92\ea\8dp\1ad\ee\01\daJw\ef\9a\99\a3m\a2\85k}\b4{x\t\f2w\18\ddy\a1\e4T\b4\c2\c5\9b[\92\86[\86=]\96\c8\c5S5\c8\b3\a0\97\fa\\\b4*\95\e3_\a0\99\bd\9fF\de%\8c9\db4\c2\9b\a5\\\9f\98\a3r\9a\c6\f6\ce\be\e9TS\bf\dc\b7\e2A\"\f2\17\f3\fc\88\a5x\\\d3\9b\ce \cc\dfS!{\f3Z\16\98:0\1f\97\dc\b5\a0\e2\96\b3\e3\\S\d1\d9\a8<D\a7\a4\d9|\9b\fb\10D\a4\a7LLv\bb\1a\9c@\b6\ef\8e\ab\8b,\84W\a6\10\ef\1f\d0)1\91\e9\e5\a4\10\9b\9d\0c\9c\a1\fb\9b\10\e7)\f4;b\d9 (\ac\85\cf\a7z^KD\80-\dd\ac\03@\e4!\bf\8f\ffD^/\9cg\8eA\b8\8c\9c\9d\173\d4\a9\1b\e3\b4\92\db\19\9e\d9w\df\ban\bf\96\ebk\ee\f0\9b;\02\87\af")
 (data $28 (i32.const 13248) "<\fbW\fbr\fb\8c\fb\a7\fb\c1\fb\dc\fb\f6\fb\11\fc,\fcF\fca\fc{\fc\96\fc\b1\fc\cb\fc\e6\fc\00\fd\1b\fd5\fdP\fdk\fd\85\fd\a0\fd\ba\fd\d5\fd\ef\fd\n\fe%\fe?\feZ\fet\fe\8f\fe\a9\fe\c4\fe\df\fe\f9\fe\14\ff.\ffI\ffc\ff~\ff\99\ff\b3\ff\ce\ff\e8\ff\03\00\1e\008\00S\00m\00\88\00\a2\00\bd\00\d8\00\f2\00\r\01\'\01B\01\\\01w\01\92\01\ac\01\c7\01\e1\01\fc\01\16\021\02L\02f\02\81\02\9b\02\b6\02\d0\02\eb\02\06\03 \03;\03U\03p\03\8b\03\a5\03\c0\03\da\03\f5\03\0f\04*\04")
 (data $29 (i32.const 13424) "\01\00\00\00\n\00\00\00d\00\00\00\e8\03\00\00\10\'\00\00\a0\86\01\00@B\0f\00\80\96\98\00\00\e1\f5\05\00\ca\9a;")
 (data $30 (i32.const 13464) "0\000\000\001\000\002\000\003\000\004\000\005\000\006\000\007\000\008\000\009\001\000\001\001\001\002\001\003\001\004\001\005\001\006\001\007\001\008\001\009\002\000\002\001\002\002\002\003\002\004\002\005\002\006\002\007\002\008\002\009\003\000\003\001\003\002\003\003\003\004\003\005\003\006\003\007\003\008\003\009\004\000\004\001\004\002\004\003\004\004\004\005\004\006\004\007\004\008\004\009\005\000\005\001\005\002\005\003\005\004\005\005\005\006\005\007\005\008\005\009\006\000\006\001\006\002\006\003\006\004\006\005\006\006\006\007\006\008\006\009\007\000\007\001\007\002\007\003\007\004\007\005\007\006\007\007\007\008\007\009\008\000\008\001\008\002\008\003\008\004\008\005\008\006\008\007\008\008\008\009\009\000\009\001\009\002\009\003\009\004\009\005\009\006\009\007\009\008\009\009")
 (data $31 (i32.const 13868) "\1c")
 (data $31.1 (i32.const 13880) "\02\00\00\00\02\00\00\00.")
 (data $32 (i32.const 13900) "\1c")
 (data $32.1 (i32.const 13912) "\02")
 (data $33 (i32.const 13932) "\1c")
 (data $33.1 (i32.const 13944) "\02\00\00\00\02\00\00\000")
 (data $34 (i32.const 13964) "<")
 (data $34.1 (i32.const 13976) "\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00s\00t\00a\00t\00i\00c\00a\00r\00r\00a\00y\00.\00t\00s")
 (data $35 (i32.const 14028) "\1c")
 (data $35.1 (i32.const 14040) "\02\00\00\00\04\00\00\00:\00 ")
 (data $36 (i32.const 14060) ",\00\00\00\03\00\00\00\00\00\00\00\0b\00\00\00\10\00\00\00\00\00\00\00\e06\00\00\00\00\00\00\b0\17")
 (data $37 (i32.const 14108) "|")
 (data $37.1 (i32.const 14120) "\02\00\00\00d\00\00\00t\00o\00S\00t\00r\00i\00n\00g\00(\00)\00 \00r\00a\00d\00i\00x\00 \00a\00r\00g\00u\00m\00e\00n\00t\00 \00m\00u\00s\00t\00 \00b\00e\00 \00b\00e\00t\00w\00e\00e\00n\00 \002\00 \00a\00n\00d\00 \003\006")
 (data $38 (i32.const 14236) "<")
 (data $38.1 (i32.const 14248) "\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00u\00t\00i\00l\00/\00n\00u\00m\00b\00e\00r\00.\00t\00s")
 (data $39 (i32.const 14300) "\1c\04")
 (data $39.1 (i32.const 14312) "\02\00\00\00\00\04\00\000\000\000\001\000\002\000\003\000\004\000\005\000\006\000\007\000\008\000\009\000\00a\000\00b\000\00c\000\00d\000\00e\000\00f\001\000\001\001\001\002\001\003\001\004\001\005\001\006\001\007\001\008\001\009\001\00a\001\00b\001\00c\001\00d\001\00e\001\00f\002\000\002\001\002\002\002\003\002\004\002\005\002\006\002\007\002\008\002\009\002\00a\002\00b\002\00c\002\00d\002\00e\002\00f\003\000\003\001\003\002\003\003\003\004\003\005\003\006\003\007\003\008\003\009\003\00a\003\00b\003\00c\003\00d\003\00e\003\00f\004\000\004\001\004\002\004\003\004\004\004\005\004\006\004\007\004\008\004\009\004\00a\004\00b\004\00c\004\00d\004\00e\004\00f\005\000\005\001\005\002\005\003\005\004\005\005\005\006\005\007\005\008\005\009\005\00a\005\00b\005\00c\005\00d\005\00e\005\00f\006\000\006\001\006\002\006\003\006\004\006\005\006\006\006\007\006\008\006\009\006\00a\006\00b\006\00c\006\00d\006\00e\006\00f\007\000\007\001\007\002\007\003\007\004\007\005\007\006\007\007\007\008\007\009\007\00a\007\00b\007\00c\007\00d\007\00e\007\00f\008\000\008\001\008\002\008\003\008\004\008\005\008\006\008\007\008\008\008\009\008\00a\008\00b\008\00c\008\00d\008\00e\008\00f\009\000\009\001\009\002\009\003\009\004\009\005\009\006\009\007\009\008\009\009\009\00a\009\00b\009\00c\009\00d\009\00e\009\00f\00a\000\00a\001\00a\002\00a\003\00a\004\00a\005\00a\006\00a\007\00a\008\00a\009\00a\00a\00a\00b\00a\00c\00a\00d\00a\00e\00a\00f\00b\000\00b\001\00b\002\00b\003\00b\004\00b\005\00b\006\00b\007\00b\008\00b\009\00b\00a\00b\00b\00b\00c\00b\00d\00b\00e\00b\00f\00c\000\00c\001\00c\002\00c\003\00c\004\00c\005\00c\006\00c\007\00c\008\00c\009\00c\00a\00c\00b\00c\00c\00c\00d\00c\00e\00c\00f\00d\000\00d\001\00d\002\00d\003\00d\004\00d\005\00d\006\00d\007\00d\008\00d\009\00d\00a\00d\00b\00d\00c\00d\00d\00d\00e\00d\00f\00e\000\00e\001\00e\002\00e\003\00e\004\00e\005\00e\006\00e\007\00e\008\00e\009\00e\00a\00e\00b\00e\00c\00e\00d\00e\00e\00e\00f\00f\000\00f\001\00f\002\00f\003\00f\004\00f\005\00f\006\00f\007\00f\008\00f\009\00f\00a\00f\00b\00f\00c\00f\00d\00f\00e\00f\00f")
 (data $40 (i32.const 15356) "\\")
 (data $40.1 (i32.const 15368) "\02\00\00\00H\00\00\000\001\002\003\004\005\006\007\008\009\00a\00b\00c\00d\00e\00f\00g\00h\00i\00j\00k\00l\00m\00n\00o\00p\00q\00r\00s\00t\00u\00v\00w\00x\00y\00z")
 (data $41 (i32.const 15452) "<")
 (data $41.1 (i32.const 15464) "\02\00\00\00$\00\00\00K\00e\00y\00 \00d\00o\00e\00s\00 \00n\00o\00t\00 \00e\00x\00i\00s\00t")
 (data $42 (i32.const 15516) ",")
 (data $42.1 (i32.const 15528) "\02\00\00\00\16\00\00\00~\00l\00i\00b\00/\00m\00a\00p\00.\00t\00s")
 (data $43 (i32.const 15564) "\1c")
 (data $43.1 (i32.const 15576) "\02\00\00\00\08\00\00\00 \00}\00 \00}")
 (data $44 (i32.const 15596) "<")
 (data $44.1 (i32.const 15608) "\02\00\00\00&\00\00\00\n\00D\00e\00c\00l\00a\00r\00e\00d\00 \00M\00e\00m\00o\00r\00y\00A\00:\00 ")
 (data $45 (i32.const 15660) "\1c")
 (data $45.1 (i32.const 15672) "\02\00\00\00\n\00\00\00N\00o\00d\00e\00_")
 (data $46 (i32.const 15692) "\1c")
 (data $46.1 (i32.const 15704) "\02\00\00\00\02\00\00\00_")
 (data $47 (i32.const 15724) ",\00\00\00\03\00\00\00\00\00\00\00\0b\00\00\00\18\00\00\00@=\00\00\00\00\00\00`=\00\00\00\00\00\00`=")
 (data $48 (i32.const 15772) "<")
 (data $48.1 (i32.const 15784) "\02\00\00\00*\00\00\00E\00n\00t\00a\00n\00g\00l\00e\00d\00N\00o\00d\00e\00 \00{\00 \00i\00d\00:\00 \00\"")
 (data $49 (i32.const 15836) ",")
 (data $49.1 (i32.const 15848) "\02\00\00\00\12\00\00\00\"\00,\00 \00p\00r\00i\00:\00 \00[")
 (data $50 (i32.const 15884) ",")
 (data $50.1 (i32.const 15896) "\02\00\00\00\1c\00\00\00]\00,\00 \00c\00o\00h\00e\00r\00e\00n\00c\00e\00:\00 ")
 (data $51 (i32.const 15932) ",")
 (data $51.1 (i32.const 15944) "\02\00\00\00\1c\00\00\00,\00 \00p\00h\00a\00s\00e\00R\00i\00n\00g\00:\00 \00[")
 (data $52 (i32.const 15980) "\1c")
 (data $52.1 (i32.const 15992) "\02\00\00\00\06\00\00\00]\00 \00}")
 (data $53 (i32.const 16012) "L\00\00\00\03\00\00\00\00\00\00\00\0b\00\00\004\00\00\00\b0=\00\00\00\00\00\00\f0=\00\00\00\00\00\00\b0\17\00\00\00\00\00\00\b0\17\00\00\00\00\00\00 >\00\00\00\00\00\00P>\00\00\00\00\00\00\80>")
 (data $54 (i32.const 16092) "\1c")
 (data $54.1 (i32.const 16104) "\0e\00\00\00\08\00\00\00\01")
 (data $55 (i32.const 16124) "<")
 (data $55.1 (i32.const 16136) "\02\00\00\00 \00\00\00D\00e\00c\00l\00a\00r\00e\00d\00 \00A\00l\00p\00h\00a\00:\00 ")
 (data $56 (i32.const 16188) ",")
 (data $56.1 (i32.const 16200) "\02\00\00\00\1c\00\00\00w\00i\00s\00d\00o\00m\00 \00i\00n\00s\00i\00g\00h\00t")
 (data $57 (i32.const 16236) "<")
 (data $57.1 (i32.const 16248) "\02\00\00\00$\00\00\00D\00e\00c\00l\00a\00r\00e\00d\00 \00M\00e\00m\00o\00r\00y\00B\00:\00 ")
 (data $58 (i32.const 16300) "<")
 (data $58.1 (i32.const 16312) "\02\00\00\00\1e\00\00\00D\00e\00c\00l\00a\00r\00e\00d\00 \00B\00e\00t\00a\00:\00 ")
 (data $59 (i32.const 16364) "<")
 (data $59.1 (i32.const 16376) "\02\00\00\00 \00\00\00D\00e\00c\00l\00a\00r\00e\00d\00 \00G\00a\00m\00m\00a\00:\00 ")
 (data $60 (i32.const 16428) "<")
 (data $60.1 (i32.const 16440) "\02\00\00\00 \00\00\00D\00e\00c\00l\00a\00r\00e\00d\00 \00D\00e\00l\00t\00a\00:\00 ")
 (data $61 (i32.const 16492) "|")
 (data $61.1 (i32.const 16504) "\02\00\00\00^\00\00\00U\00n\00e\00x\00p\00e\00c\00t\00e\00d\00 \00\'\00n\00u\00l\00l\00\'\00 \00(\00n\00o\00t\00 \00a\00s\00s\00i\00g\00n\00e\00d\00 \00o\00r\00 \00f\00a\00i\00l\00e\00d\00 \00c\00a\00s\00t\00)")
 (data $62 (i32.const 16620) "<")
 (data $62.1 (i32.const 16632) "\02\00\00\00\"\00\00\00a\00s\00s\00e\00m\00b\00l\00y\00/\00i\00n\00d\00e\00x\00.\00t\00s")
 (data $63 (i32.const 16684) "<")
 (data $63.1 (i32.const 16696) "\02\00\00\00,\00\00\00\n\00C\00u\00r\00r\00e\00n\00t\00 \00N\00o\00d\00e\00 \00s\00e\00t\00 \00t\00o\00:\00 ")
 (data $64 (i32.const 16748) "\\")
 (data $64.1 (i32.const 16760) "\02\00\00\00H\00\00\00\n\00T\00e\00n\00s\00o\00r\00 \00(\00M\00e\00m\00o\00r\00y\00A\00 \00\97\" \00M\00e\00m\00o\00r\00y\00B\00)\00 \00=\00>\00 \00P\00s\00i\00:\00 ")
 (data $65 (i32.const 16844) "l")
 (data $65.1 (i32.const 16856) "\02\00\00\00P\00\00\00\n\00C\00o\00l\00l\00a\00p\00s\00e\00 \00(\00P\00s\00i\00 \00\dd! \00c\00o\00l\00l\00a\00p\00s\00e\00(\00)\00)\00 \00=\00>\00 \00R\00e\00s\00u\00l\00t\00:\00 ")
 (data $66 (i32.const 16956) "\\")
 (data $66.1 (i32.const 16968) "\02\00\00\00B\00\00\00\n\00B\00e\00f\00o\00r\00e\00 \00p\00h\00a\00s\00e\00 \00m\00o\00d\00u\00l\00a\00t\00i\00o\00n\00,\00 \00A\00l\00p\00h\00a\00:\00 ")
 (data $67 (i32.const 17052) "|")
 (data $67.1 (i32.const 17064) "\02\00\00\00l\00\00\00A\00f\00t\00e\00r\00 \00p\00h\00a\00s\00e\00 \00m\00o\00d\00u\00l\00a\00t\00i\00o\00n\00 \00(\00A\00l\00p\00h\00a\00 \00\f3\' \00r\00o\00t\00a\00t\00e\00P\00h\00a\00s\00e\00(\00P\00I\00 \00/\00 \003\00)\00)\00:\00 ")
 (data $68 (i32.const 17180) "\8c")
 (data $68.1 (i32.const 17192) "\02\00\00\00x\00\00\00\n\00M\00a\00n\00u\00a\00l\00l\00y\00 \00a\00d\00j\00u\00s\00t\00i\00n\00g\00 \00c\00o\00h\00e\00r\00e\00n\00c\00e\00 \00f\00o\00r\00 \00e\00n\00t\00a\00n\00g\00l\00e\00m\00e\00n\00t\00 \00c\00h\00e\00c\00k\00:\00 \00A\00l\00p\00h\00a\00=")
 (data $69 (i32.const 17324) ",")
 (data $69.1 (i32.const 17336) "\02\00\00\00\0e\00\00\00,\00 \00B\00e\00t\00a\00=")
 (data $70 (i32.const 17372) ",\00\00\00\03\00\00\00\00\00\00\00\0b\00\00\00\10\00\00\000C\00\00\00\00\00\00\c0C")
 (data $71 (i32.const 17420) "<")
 (data $71.1 (i32.const 17432) "\02\00\00\00\"\00\00\00[\00O\00P\00E\00R\00A\00T\00O\00R\00]\00 \00N\00o\00d\00e\00s\00 ")
 (data $72 (i32.const 17484) "\1c")
 (data $72.1 (i32.const 17496) "\02\00\00\00\n\00\00\00 \00a\00n\00d\00 ")
 (data $73 (i32.const 17516) "\\")
 (data $73.1 (i32.const 17528) "\02\00\00\00B\00\00\00 \00a\00r\00e\00 \00e\00n\00t\00a\00n\00g\00l\00e\00d\00.\00 \00N\00e\00w\00 \00c\00o\00h\00e\00r\00e\00n\00c\00e\00:\00 \00A\00=")
 (data $74 (i32.const 17612) "\1c")
 (data $74.1 (i32.const 17624) "\02\00\00\00\08\00\00\00,\00 \00B\00=")
 (data $75 (i32.const 17644) "<\00\00\00\03\00\00\00\00\00\00\00\0b\00\00\00 \00\00\00 D\00\00\00\00\00\00`D\00\00\00\00\00\00\80D\00\00\00\00\00\00\e0D")
 (data $76 (i32.const 17708) "l")
 (data $76.1 (i32.const 17720) "\02\00\00\00Z\00\00\00 \00c\00a\00n\00n\00o\00t\00 \00e\00n\00t\00a\00n\00g\00l\00e\00.\00 \00A\00v\00e\00r\00a\00g\00e\00 \00c\00o\00h\00e\00r\00e\00n\00c\00e\00 \00t\00o\00o\00 \00l\00o\00w\00:\00 ")
 (data $77 (i32.const 17820) ",\00\00\00\03\00\00\00\00\00\00\00\0b\00\00\00\18\00\00\00 D\00\00\00\00\00\00`D\00\00\00\00\00\00@E")
 (data $78 (i32.const 17868) "\\")
 (data $78.1 (i32.const 17880) "\02\00\00\00@\00\00\00A\00l\00p\00h\00a\00 \00a\00f\00t\00e\00r\00 \00e\00n\00t\00a\00n\00g\00l\00e\00m\00e\00n\00t\00 \00c\00h\00e\00c\00k\00:\00 ")
 (data $79 (i32.const 17964) "\\")
 (data $79.1 (i32.const 17976) "\02\00\00\00>\00\00\00B\00e\00t\00a\00 \00a\00f\00t\00e\00r\00 \00e\00n\00t\00a\00n\00g\00l\00e\00m\00e\00n\00t\00 \00c\00h\00e\00c\00k\00:\00 ")
 (data $80 (i32.const 18060) "\\")
 (data $80.1 (i32.const 18072) "\02\00\00\00H\00\00\00[\00O\00P\00E\00R\00A\00T\00O\00R\00]\00 \00A\00t\00t\00e\00m\00p\00t\00i\00n\00g\00 \00t\00o\00 \00r\00o\00u\00t\00e\00 \00f\00r\00o\00m\00 ")
 (data $81 (i32.const 18156) "\1c")
 (data $81.1 (i32.const 18168) "\02\00\00\00\08\00\00\00 \00t\00o\00 ")
 (data $82 (i32.const 18188) "\1c")
 (data $82.1 (i32.const 18200) "\02\00\00\00\0c\00\00\00 \00v\00i\00a\00 \00[")
 (data $83 (i32.const 18220) "\1c")
 (data $83.1 (i32.const 18232) "\02\00\00\00\02\00\00\00]")
 (data $84 (i32.const 18252) ",\00\00\00\03\00\00\00\00\00\00\00\0b\00\00\00\1c\00\00\00\a0F\00\00\00\00\00\00\00G\00\00\00\00\00\00 G\00\00\00\00\00\00@G")
 (data $85 (i32.const 18300) "\1c")
 (data $85.1 (i32.const 18312) "\10\00\00\00\08\00\00\00\02")
 (data $86 (i32.const 18332) "\\")
 (data $86.1 (i32.const 18344) "\02\00\00\00F\00\00\00[\00O\00P\00E\00R\00A\00T\00O\00R\00]\00 \00R\00o\00u\00t\00i\00n\00g\00 \00f\00a\00i\00l\00e\00d\00:\00 \00S\00o\00u\00r\00c\00e\00 \00(")
 (data $87 (i32.const 18428) ",")
 (data $87.1 (i32.const 18440) "\02\00\00\00\1a\00\00\00)\00 \00o\00r\00 \00t\00a\00r\00g\00e\00t\00 \00(")
 (data $88 (i32.const 18476) "<")
 (data $88.1 (i32.const 18488) "\02\00\00\00(\00\00\00)\00 \00c\00o\00h\00e\00r\00e\00n\00c\00e\00 \00t\00o\00o\00 \00l\00o\00w\00.")
 (data $89 (i32.const 18540) ",\00\00\00\03\00\00\00\00\00\00\00\0b\00\00\00\14\00\00\00\b0G\00\00\00\00\00\00\10H\00\00\00\00\00\00@H")
 (data $90 (i32.const 18588) "|")
 (data $90.1 (i32.const 18600) "\02\00\00\00^\00\00\00E\00l\00e\00m\00e\00n\00t\00 \00t\00y\00p\00e\00 \00m\00u\00s\00t\00 \00b\00e\00 \00n\00u\00l\00l\00a\00b\00l\00e\00 \00i\00f\00 \00a\00r\00r\00a\00y\00 \00i\00s\00 \00h\00o\00l\00e\00y")
 (data $91 (i32.const 18716) "\\")
 (data $91.1 (i32.const 18728) "\02\00\00\00H\00\00\00[\00O\00P\00E\00R\00A\00T\00O\00R\00]\00 \00R\00o\00u\00t\00i\00n\00g\00 \00f\00a\00i\00l\00e\00d\00:\00 \00V\00i\00a\00 \00n\00o\00d\00e\00 ")
 (data $92 (i32.const 18812) "L")
 (data $92.1 (i32.const 18824) "\02\00\00\00:\00\00\00 \00h\00a\00s\00 \00i\00n\00s\00u\00f\00f\00i\00c\00i\00e\00n\00t\00 \00c\00o\00h\00e\00r\00e\00n\00c\00e\00 \00(")
 (data $93 (i32.const 18892) "\1c")
 (data $93.1 (i32.const 18904) "\02\00\00\00\04\00\00\00)\00.")
 (data $94 (i32.const 18924) ",\00\00\00\03\00\00\00\00\00\00\00\0b\00\00\00\14\00\00\000I\00\00\00\00\00\00\90I\00\00\00\00\00\00\e0I")
 (data $95 (i32.const 18972) "l")
 (data $95.1 (i32.const 18984) "\02\00\00\00V\00\00\00[\00O\00P\00E\00R\00A\00T\00O\00R\00]\00 \00R\00o\00u\00t\00i\00n\00g\00 \00s\00u\00c\00c\00e\00s\00s\00f\00u\00l\00 \00(\00c\00o\00n\00c\00e\00p\00t\00u\00a\00l\00)\00.")
 (data $96 (i32.const 19084) ",")
 (data $96.1 (i32.const 19096) "\02\00\00\00\14\00\00\00S\00u\00c\00c\00e\00s\00s\00f\00u\00l")
 (data $97 (i32.const 19132) "\1c")
 (data $97.1 (i32.const 19144) "\02\00\00\00\0c\00\00\00F\00a\00i\00l\00e\00d")
 (data $98 (i32.const 19164) "l")
 (data $98.1 (i32.const 19176) "\02\00\00\00V\00\00\00R\00o\00u\00t\00e\00 \00f\00r\00o\00m\00 \00A\00l\00p\00h\00a\00 \00t\00o\00 \00G\00a\00m\00m\00a\00 \00v\00i\00a\00 \00B\00e\00t\00a\00,\00 \00D\00e\00l\00t\00a\00:\00 ")
 (data $99 (i32.const 19276) "L")
 (data $99.1 (i32.const 19288) "\02\00\00\004\00\00\00\n\00-\00-\00-\00 \00F\00u\00n\00c\00t\00i\00o\00n\00a\00l\00 \00B\00l\00o\00c\00k\00s\00 \00-\00-\00-")
 (data $100 (i32.const 19356) "<")
 (data $100.1 (i32.const 19368) "\02\00\00\00\"\00\00\00[\00F\00N\00]\00 \00S\00t\00a\00b\00i\00l\00i\00z\00i\00n\00g\00 ")
 (data $101 (i32.const 19420) "L")
 (data $101.1 (i32.const 19432) "\02\00\00\002\00\00\00:\00 \00C\00u\00r\00r\00e\00n\00t\00 \00E\00n\00t\00r\00o\00p\00y\00 \00R\00a\00t\00e\00 \00=\00 ")
 (data $102 (i32.const 19500) ",")
 (data $102.1 (i32.const 19512) "\02\00\00\00\1c\00\00\00,\00 \00C\00o\00h\00e\00r\00e\00n\00c\00e\00 \00=\00 ")
 (data $103 (i32.const 19548) ",\00\00\00\03\00\00\00\00\00\00\00\0b\00\00\00\18\00\00\00\b0K\00\00\00\00\00\00\f0K\00\00\00\00\00\00@L")
 (data $104 (i32.const 19596) "\1c")
 (data $104.1 (i32.const 19608) "\02\00\00\00\n\00\00\00[\00F\00N\00]\00 ")
 (data $105 (i32.const 19628) "L")
 (data $105.1 (i32.const 19640) "\02\00\00\008\00\00\00 \00s\00t\00a\00b\00i\00l\00i\00z\00e\00d\00.\00 \00N\00e\00w\00 \00c\00o\00h\00e\00r\00e\00n\00c\00e\00:\00 ")
 (data $106 (i32.const 19708) ",\00\00\00\03\00\00\00\00\00\00\00\0b\00\00\00\10\00\00\00\a0L\00\00\00\00\00\00\c0L")
 (data $107 (i32.const 19756) "|")
 (data $107.1 (i32.const 19768) "\02\00\00\00^\00\00\00 \00s\00t\00a\00b\00i\00l\00i\00z\00a\00t\00i\00o\00n\00 \00n\00o\00t\00 \00n\00e\00e\00d\00e\00d\00 \00o\00r\00 \00f\00a\00i\00l\00e\00d\00 \00c\00o\00n\00d\00i\00t\00i\00o\00n\00s\00.")
 (data $108 (i32.const 19884) "\1c\00\00\00\03\00\00\00\00\00\00\00\0b\00\00\00\0c\00\00\00\a0L\00\00\00\00\00\00@M")
 (data $109 (i32.const 19916) "\1c")
 (data $109.1 (i32.const 19928) "\02\00\00\00\08\00\00\00t\00r\00u\00e")
 (data $110 (i32.const 19948) "\1c")
 (data $110.1 (i32.const 19960) "\02\00\00\00\n\00\00\00f\00a\00l\00s\00e")
 (data $111 (i32.const 19980) "<")
 (data $111.1 (i32.const 19992) "\02\00\00\00\"\00\00\00S\00t\00a\00b\00i\00l\00i\00z\00e\00 \00A\00l\00p\00h\00a\00:\00 ")
 (data $112 (i32.const 20044) "\8c")
 (data $112.1 (i32.const 20056) "\02\00\00\00t\00\00\00[\00F\00N\00]\00 \00T\00e\00l\00e\00p\00o\00r\00t\00a\00t\00i\00o\00n\00 \00f\00a\00i\00l\00e\00d\00:\00 \00N\00o\00 \00c\00u\00r\00r\00e\00n\00t\00 \00n\00o\00d\00e\00 \00(\00t\00h\00i\00s\00N\00o\00d\00e\00)\00 \00s\00e\00t\00.")
 (data $113 (i32.const 20188) "L")
 (data $113.1 (i32.const 20200) "\02\00\00\008\00\00\00a\00s\00s\00e\00m\00b\00l\00y\00/\00f\00u\00n\00c\00t\00i\00o\00n\00a\00l\00B\00l\00o\00c\00k\00s\00.\00t\00s")
 (data $114 (i32.const 20268) "|")
 (data $114.1 (i32.const 20280) "\02\00\00\00^\00\00\00[\00F\00N\00]\00 \00A\00t\00t\00e\00m\00p\00t\00i\00n\00g\00 \00t\00o\00 \00t\00e\00l\00e\00p\00o\00r\00t\00 \00f\00r\00a\00g\00m\00e\00n\00t\00 \00(\00e\00n\00t\00r\00o\00p\00y\00:\00 ")
 (data $115 (i32.const 20396) ",")
 (data $115.1 (i32.const 20408) "\02\00\00\00\0e\00\00\00)\00 \00f\00r\00o\00m\00 ")
 (data $116 (i32.const 20444) ",")
 (data $116.1 (i32.const 20456) "\02\00\00\00\1a\00\00\00.\00 \00E\00n\00t\00a\00n\00g\00l\00e\00d\00?\00 ")
 (data $117 (i32.const 20492) "<")
 (data $117.1 (i32.const 20504) "\02\00\00\00(\00\00\00,\00 \00T\00a\00r\00g\00e\00t\00 \00C\00o\00h\00e\00r\00e\00n\00c\00e\00:\00 ")
 (data $118 (i32.const 20556) "<\00\00\00\03\00\00\00\00\00\00\00\0b\00\00\00(\00\00\00@O\00\00\00\00\00\00\c0O\00\00\00\00\00\00\00G\00\00\00\00\00\00\f0O\00\00\00\00\00\00 P")
 (data $119 (i32.const 20620) "<")
 (data $119.1 (i32.const 20632) "\02\00\00\00\1e\00\00\00[\00F\00N\00]\00 \00F\00r\00a\00g\00m\00e\00n\00t\00 \00\"")
 (data $120 (i32.const 20684) "L")
 (data $120.1 (i32.const 20696) "\02\00\00\00:\00\00\00\"\00 \00s\00u\00c\00c\00e\00s\00s\00f\00u\00l\00l\00y\00 \00t\00e\00l\00e\00p\00o\00r\00t\00e\00d\00 \00t\00o\00 ")
 (data $121 (i32.const 20764) "\1c")
 (data $121.1 (i32.const 20776) "\02\00\00\00\02\00\00\00!")
 (data $122 (i32.const 20796) ",\00\00\00\03\00\00\00\00\00\00\00\0b\00\00\00\14\00\00\00\a0P\00\00\00\00\00\00\e0P\00\00\00\00\00\000Q")
 (data $123 (i32.const 20844) "l")
 (data $123.1 (i32.const 20856) "\02\00\00\00\\\00\00\00[\00F\00N\00]\00 \00T\00e\00l\00e\00p\00o\00r\00t\00a\00t\00i\00o\00n\00 \00f\00a\00i\00l\00e\00d\00.\00 \00C\00o\00n\00d\00i\00t\00i\00o\00n\00s\00 \00n\00o\00t\00 \00m\00e\00t\00.")
 (data $124 (i32.const 20956) "L")
 (data $124.1 (i32.const 20968) "\02\00\00\006\00\00\00T\00e\00l\00e\00p\00o\00r\00t\00 \00M\00e\00m\00o\00r\00y\00A\00 \00t\00o\00 \00G\00a\00m\00m\00a\00:\00 ")
 (data $125 (i32.const 21036) "L")
 (data $125.1 (i32.const 21048) "\02\00\00\006\00\00\00\n\00-\00-\00-\00 \00E\00n\00t\00r\00o\00p\00y\00 \00M\00o\00n\00i\00t\00o\00r\00i\00n\00g\00 \00-\00-\00-")
 (data $126 (i32.const 21116) "\\")
 (data $126.1 (i32.const 21128) "\02\00\00\00J\00\00\00E\00n\00t\00r\00o\00p\00y\00 \00d\00r\00i\00f\00t\00 \00f\00o\00r\00 \00A\00l\00p\00h\00a\00\'\00s\00 \00p\00h\00a\00s\00e\00R\00i\00n\00g\00:\00 ")
 (data $127 (i32.const 21212) "\cc")
 (data $127.1 (i32.const 21224) "\02\00\00\00\b6\00\00\00S\00i\00g\00n\00i\00f\00i\00c\00a\00n\00t\00 \00s\00t\00a\00b\00i\00l\00i\00t\00y\00/\00a\00l\00i\00g\00n\00m\00e\00n\00t\00 \00d\00e\00t\00e\00c\00t\00e\00d\00 \00(\00n\00e\00g\00a\00t\00i\00v\00e\00 \00d\00r\00i\00f\00t\00)\00.\00 \00A\00t\00t\00e\00m\00p\00t\00i\00n\00g\00 \00t\00o\00 \00s\00t\00a\00b\00i\00l\00i\00z\00e\00 \00A\00l\00p\00h\00a\00.\00.\00.")
 (data $128 (i32.const 21420) "\9c")
 (data $128.1 (i32.const 21432) "\02\00\00\00\84\00\00\00N\00o\00 \00s\00i\00g\00n\00i\00f\00i\00c\00a\00n\00t\00 \00d\00r\00i\00f\00t\00 \00(\00o\00r\00 \00s\00u\00f\00f\00i\00c\00i\00e\00n\00t\00 \00s\00t\00a\00b\00i\00l\00i\00t\00y\00)\00 \00d\00e\00t\00e\00c\00t\00e\00d\00 \00f\00o\00r\00 \00A\00l\00p\00h\00a\00.")
 (data $129 (i32.const 21580) "L")
 (data $129.1 (i32.const 21592) "\02\00\00\008\00\00\00\n\00-\00-\00-\00 \00C\00o\00l\00l\00a\00p\00s\00e\00 \00C\00o\00n\00d\00i\00t\00i\00o\00n\00s\00 \00-\00-\00-")
 (data $130 (i32.const 21660) "|")
 (data $130.1 (i32.const 21672) "\02\00\00\00d\00\00\00C\00h\00e\00c\00k\00i\00n\00g\00 \00c\00o\00l\00l\00a\00p\00s\00e\00 \00c\00o\00n\00d\00i\00t\00i\00o\00n\00 \00f\00o\00r\00 \00M\00e\00m\00o\00r\00y\00A\00 \00(\00e\00n\00t\00r\00o\00p\00y\00:\00 ")
 (data $131 (i32.const 21788) "L")
 (data $131.1 (i32.const 21800) "\02\00\00\00<\00\00\00)\00 \00a\00n\00d\00 \00C\00u\00r\00r\00e\00n\00t\00N\00o\00d\00e\00 \00(\00c\00o\00h\00e\00r\00e\00n\00c\00e\00:\00 ")
 (data $132 (i32.const 21868) "\1c")
 (data $132.1 (i32.const 21880) "\02\00\00\00\02\00\00\00)")
 (data $133 (i32.const 21900) ",\00\00\00\03\00\00\00\00\00\00\00\0b\00\00\00\14\00\00\00\b0T\00\00\00\00\00\000U\00\00\00\00\00\00\80U")
 (data $134 (i32.const 21948) "\\")
 (data $134.1 (i32.const 21960) "\02\00\00\00J\00\00\00M\00e\00m\00o\00r\00y\00A\00 \00c\00o\00l\00l\00a\00p\00s\00e\00d\00 \00d\00u\00e\00 \00t\00o\00 \00c\00o\00n\00d\00i\00t\00i\00o\00n\00s\00:\00 ")
 (data $135 (i32.const 22044) "l")
 (data $135.1 (i32.const 22056) "\02\00\00\00Z\00\00\00M\00e\00m\00o\00r\00y\00A\00 \00d\00i\00d\00 \00n\00o\00t\00 \00c\00o\00l\00l\00a\00p\00s\00e\00.\00 \00C\00o\00n\00d\00i\00t\00i\00o\00n\00s\00 \00n\00o\00t\00 \00m\00e\00t\00.")
 (data $136 (i32.const 22156) "\\")
 (data $136.1 (i32.const 22168) "\02\00\00\00L\00\00\00\n\00-\00-\00-\00 \00S\00y\00m\00b\00o\00l\00i\00c\00 \00P\00a\00t\00t\00e\00r\00n\00 \00C\00o\00n\00s\00t\00r\00u\00c\00t\00i\00o\00n\00 \00-\00-\00-")
 (data $137 (i32.const 22252) ",")
 (data $137.1 (i32.const 22264) "\02\00\00\00\0e\00\00\00H\00a\00r\00m\00o\00n\00y")
 (data $138 (i32.const 22300) "<")
 (data $138.1 (i32.const 22312) "\02\00\00\00*\00\00\00A\00t\00t\00r\00a\00c\00t\00o\00r\00 \00{\00 \00s\00y\00m\00b\00o\00l\00:\00 \00\"")
 (data $139 (i32.const 22364) ",")
 (data $139.1 (i32.const 22376) "\02\00\00\00\1c\00\00\00\"\00,\00 \00c\00o\00h\00e\00r\00e\00n\00c\00e\00:\00 ")
 (data $140 (i32.const 22412) ",")
 (data $140.1 (i32.const 22424) "\02\00\00\00\16\00\00\00,\00 \00p\00r\00i\00m\00e\00s\00:\00 \00[")
 (data $141 (i32.const 22460) "<")
 (data $141.1 (i32.const 22472) "\02\00\00\00\"\00\00\00]\00,\00 \00t\00a\00r\00g\00e\00t\00P\00h\00a\00s\00e\00:\00 \00[")
 (data $142 (i32.const 22524) "<\00\00\00\03\00\00\00\00\00\00\00\0b\00\00\00$\00\00\000W\00\00\00\00\00\00pW\00\00\00\00\00\00\a0W\00\00\00\00\00\00\d0W\00\00\00\00\00\00\80>")
 (data $143 (i32.const 22588) "\1c")
 (data $143.1 (i32.const 22600) "\0e\00\00\00\08\00\00\00\03")
 (data $144 (i32.const 22620) "L")
 (data $144.1 (i32.const 22632) "\02\00\00\008\00\00\00D\00e\00c\00l\00a\00r\00e\00d\00 \00A\00t\00t\00r\00a\00c\00t\00o\00r\00 \00H\00a\00r\00m\00o\00n\00y\00:\00 ")
 (data $145 (i32.const 22700) "L")
 (data $145.1 (i32.const 22712) "\02\00\00\000\00\00\00\n\00-\00-\00-\00 \00M\00e\00t\00a\00-\00C\00o\00n\00s\00t\00r\00u\00c\00t\00s\00 \00-\00-\00-")
 (data $146 (i32.const 22780) "l")
 (data $146.1 (i32.const 22792) "\02\00\00\00V\00\00\00[\00M\00E\00T\00A\00]\00 \00O\00b\00s\00e\00r\00v\00i\00n\00g\00 \00p\00h\00a\00s\00e\00 \00r\00i\00n\00g\00 \00o\00f\00 \00r\00e\00m\00o\00t\00e\00 \00n\00o\00d\00e\00 ")
 (data $147 (i32.const 22892) "l")
 (data $147.1 (i32.const 22904) "\02\00\00\00N\00\00\00[\00M\00E\00T\00A\00]\00 \00O\00b\00s\00e\00r\00v\00a\00t\00i\00o\00n\00 \00f\00a\00i\00l\00e\00d\00:\00 \00R\00e\00m\00o\00t\00e\00 \00n\00o\00d\00e\00 ")
 (data $148 (i32.const 23004) "<")
 (data $148.1 (i32.const 23016) "\02\00\00\00(\00\00\00 \00c\00o\00h\00e\00r\00e\00n\00c\00e\00 \00t\00o\00o\00 \00l\00o\00w\00 \00(")
 (data $149 (i32.const 23068) ",\00\00\00\03\00\00\00\00\00\00\00\0b\00\00\00\14\00\00\00\80Y\00\00\00\00\00\00\f0Y\00\00\00\00\00\00\e0I")
 (data $150 (i32.const 23116) "L")
 (data $150.1 (i32.const 23128) "\02\00\00\008\00\00\00O\00b\00s\00e\00r\00v\00e\00d\00 \00p\00h\00a\00s\00e\00s\00 \00f\00r\00o\00m\00 \00B\00e\00t\00a\00:\00 \00[")
 (data $151 (i32.const 23196) "\1c\00\00\00\03\00\00\00\00\00\00\00\0b\00\00\00\0c\00\00\00`Z\00\00\00\00\00\00@G")
 (data $152 (i32.const 23228) "\1c")
 (data $152.1 (i32.const 23240) "\0e\00\00\00\08\00\00\00\04")
 (data $153 (i32.const 23260) "\1c")
 (data $153.1 (i32.const 23272) "\02\00\00\00\n\00\00\00t\00r\00u\00t\00h")
 (data $154 (i32.const 23292) "L")
 (data $154.1 (i32.const 23304) "\02\00\00\00:\00\00\00D\00e\00c\00l\00a\00r\00e\00d\00 \00@\00r\00e\00s\00o\00n\00a\00n\00t\00 \00U\00n\00i\00v\00e\00r\00s\00e\00:\00 ")
 (data $155 (i32.const 23372) "l")
 (data $155.1 (i32.const 23384) "\02\00\00\00Z\00\00\00\n\00-\00-\00-\00 \00R\00e\00s\00o\00L\00a\00n\00g\00 \00E\00x\00a\00m\00p\00l\00e\00 \00P\00r\00o\00g\00r\00a\00m\00 \00(\00f\00r\00o\00m\00 \00s\00p\00e\00c\00)\00 \00-\00-\00-")
 (data $156 (i32.const 23484) "<")
 (data $156.1 (i32.const 23496) "\02\00\00\00&\00\00\00D\00e\00c\00l\00a\00r\00e\00d\00 \00O\00b\00s\00e\00r\00v\00e\00r\00:\00 ")
 (data $157 (i32.const 23548) "L")
 (data $157.1 (i32.const 23560) "\02\00\00\00<\00\00\00t\00h\00e\00 \00w\00h\00o\00l\00e\00 \00i\00s\00 \00m\00o\00r\00e\00 \00t\00h\00a\00n\00 \00t\00h\00e\00 \00s\00u\00m")
 (data $158 (i32.const 23628) "<")
 (data $158.1 (i32.const 23640) "\02\00\00\00$\00\00\00D\00e\00c\00l\00a\00r\00e\00d\00 \00T\00h\00o\00u\00g\00h\00t\00:\00 ")
 (data $159 (i32.const 23692) "<")
 (data $159.1 (i32.const 23704) "\02\00\00\00*\00\00\00C\00u\00r\00r\00e\00n\00t\00 \00N\00o\00d\00e\00 \00s\00e\00t\00 \00t\00o\00:\00 ")
 (data $160 (i32.const 23756) "\ac")
 (data $160.1 (i32.const 23768) "\02\00\00\00\92\00\00\00C\00h\00e\00c\00k\00i\00n\00g\00 \00t\00e\00l\00e\00p\00o\00r\00t\00 \00c\00o\00n\00d\00i\00t\00i\00o\00n\00 \00f\00o\00r\00 \00T\00h\00o\00u\00g\00h\00t\00 \00t\00o\00 \00O\00b\00s\00e\00r\00v\00e\00r\00.\00 \00O\00b\00s\00e\00r\00v\00e\00r\00 \00c\00o\00h\00e\00r\00e\00n\00c\00e\00:\00 ")
 (data $161 (i32.const 23932) "l")
 (data $161.1 (i32.const 23944) "\02\00\00\00N\00\00\00F\00i\00n\00a\00l\00 \00T\00e\00l\00e\00p\00o\00r\00t\00 \00o\00f\00 \00T\00h\00o\00u\00g\00h\00t\00 \00t\00o\00 \00O\00b\00s\00e\00r\00v\00e\00r\00:\00 ")
 (data $162 (i32.const 24044) "l")
 (data $162.1 (i32.const 24056) "\02\00\00\00\\\00\00\00O\00b\00s\00e\00r\00v\00e\00r\00 \00c\00o\00h\00e\00r\00e\00n\00c\00e\00 \00t\00o\00o\00 \00l\00o\00w\00 \00f\00o\00r\00 \00f\00i\00n\00a\00l\00 \00t\00e\00l\00e\00p\00o\00r\00t\00.")
 (data $163 (i32.const 24156) "l")
 (data $163.1 (i32.const 24168) "\02\00\00\00T\00\00\00\n\00-\00-\00-\00 \00R\00e\00s\00o\00L\00a\00n\00g\00 \00E\00x\00a\00m\00p\00l\00e\00 \00P\00r\00o\00g\00r\00a\00m\00 \00F\00i\00n\00i\00s\00h\00e\00d\00 \00-\00-\00-")
 (data $164 (i32.const 24272) "\12\00\00\00 \00\00\00 \00\00\00 ")
 (data $164.1 (i32.const 24296) "$\01\00\00\02\1a\00\00\00\00\00\00\10\1a\02\00$\1a\00\00\02\t\00\00\04A\00\00\02\01\00\00\02A\00\00\00\00\00\00\02A")
 (table $0 5 5 funcref)
 (elem $0 (i32.const 1) $assembly/resonlang/EntangledNode#toString~anonymous|0 $assembly/operators/route~anonymous|0 $assembly/resonlang/EntangledNode#toString~anonymous|0 $assembly/resonlang/EntangledNode#toString~anonymous|0)
 (export "runResoLangExample" (func $assembly/index/runResoLangExample))
 (export "memory" (memory $0))
 (start $~start)
 (func $~lib/rt/itcms/visitRoots
  (local $0 i32)
  (local $1 i32)
  i32.const 1456
  call $~lib/rt/itcms/__visit
  i32.const 1664
  call $~lib/rt/itcms/__visit
  i32.const 18608
  call $~lib/rt/itcms/__visit
  i32.const 15472
  call $~lib/rt/itcms/__visit
  i32.const 1264
  call $~lib/rt/itcms/__visit
  i32.const 14320
  call $~lib/rt/itcms/__visit
  i32.const 15376
  call $~lib/rt/itcms/__visit
  global.get $assembly/resonlang/currentNode
  local.tee $0
  if
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $~lib/rt/itcms/pinSpace
  local.tee $1
  i32.load offset=4
  i32.const -4
  i32.and
  local.set $0
  loop $while-continue|0
   local.get $0
   local.get $1
   i32.ne
   if
    local.get $0
    i32.load offset=4
    i32.const 3
    i32.and
    i32.const 3
    i32.ne
    if
     i32.const 0
     i32.const 1328
     i32.const 160
     i32.const 16
     call $~lib/builtins/abort
     unreachable
    end
    local.get $0
    i32.const 20
    i32.add
    call $~lib/rt/__visit_members
    local.get $0
    i32.load offset=4
    i32.const -4
    i32.and
    local.set $0
    br $while-continue|0
   end
  end
 )
 (func $~lib/rt/itcms/Object#makeGray (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  global.get $~lib/rt/itcms/iter
  i32.eq
  if
   local.get $0
   i32.load offset=8
   local.tee $1
   i32.eqz
   if
    i32.const 0
    i32.const 1328
    i32.const 148
    i32.const 30
    call $~lib/builtins/abort
    unreachable
   end
   local.get $1
   global.set $~lib/rt/itcms/iter
  end
  block $__inlined_func$~lib/rt/itcms/Object#unlink$482
   local.get $0
   i32.load offset=4
   i32.const -4
   i32.and
   local.tee $1
   i32.eqz
   if
    local.get $0
    i32.load offset=8
    i32.eqz
    local.get $0
    i32.const 57116
    i32.lt_u
    i32.and
    i32.eqz
    if
     i32.const 0
     i32.const 1328
     i32.const 128
     i32.const 18
     call $~lib/builtins/abort
     unreachable
    end
    br $__inlined_func$~lib/rt/itcms/Object#unlink$482
   end
   local.get $0
   i32.load offset=8
   local.tee $2
   i32.eqz
   if
    i32.const 0
    i32.const 1328
    i32.const 132
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   local.get $1
   local.get $2
   i32.store offset=8
   local.get $2
   local.get $1
   local.get $2
   i32.load offset=4
   i32.const 3
   i32.and
   i32.or
   i32.store offset=4
  end
  global.get $~lib/rt/itcms/toSpace
  local.set $2
  local.get $0
  i32.load offset=12
  local.tee $1
  i32.const 2
  i32.le_u
  if (result i32)
   i32.const 1
  else
   local.get $1
   i32.const 24272
   i32.load
   i32.gt_u
   if
    i32.const 1456
    i32.const 1520
    i32.const 21
    i32.const 28
    call $~lib/builtins/abort
    unreachable
   end
   local.get $1
   i32.const 2
   i32.shl
   i32.const 24276
   i32.add
   i32.load
   i32.const 32
   i32.and
  end
  local.set $3
  local.get $2
  i32.load offset=8
  local.set $1
  local.get $0
  global.get $~lib/rt/itcms/white
  i32.eqz
  i32.const 2
  local.get $3
  select
  local.get $2
  i32.or
  i32.store offset=4
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $1
  local.get $0
  local.get $1
  i32.load offset=4
  i32.const 3
  i32.and
  i32.or
  i32.store offset=4
  local.get $2
  local.get $0
  i32.store offset=8
 )
 (func $~lib/rt/itcms/__visit (param $0 i32)
  local.get $0
  i32.eqz
  if
   return
  end
  global.get $~lib/rt/itcms/white
  local.get $0
  i32.const 20
  i32.sub
  local.tee $0
  i32.load offset=4
  i32.const 3
  i32.and
  i32.eq
  if
   local.get $0
   call $~lib/rt/itcms/Object#makeGray
   global.get $~lib/rt/itcms/visitCount
   i32.const 1
   i32.add
   global.set $~lib/rt/itcms/visitCount
  end
 )
 (func $~lib/rt/tlsf/removeBlock (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $1
  i32.load
  local.tee $3
  i32.const 1
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 1600
   i32.const 268
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $3
  i32.const -4
  i32.and
  local.tee $3
  i32.const 12
  i32.lt_u
  if
   i32.const 0
   i32.const 1600
   i32.const 270
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $3
  i32.const 256
  i32.lt_u
  if (result i32)
   local.get $3
   i32.const 4
   i32.shr_u
  else
   i32.const 31
   i32.const 1073741820
   local.get $3
   local.get $3
   i32.const 1073741820
   i32.ge_u
   select
   local.tee $3
   i32.clz
   i32.sub
   local.tee $4
   i32.const 7
   i32.sub
   local.set $2
   local.get $3
   local.get $4
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
  end
  local.tee $3
  i32.const 16
  i32.lt_u
  local.get $2
  i32.const 23
  i32.lt_u
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 1600
   i32.const 284
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.load offset=8
  local.set $5
  local.get $1
  i32.load offset=4
  local.tee $4
  if
   local.get $4
   local.get $5
   i32.store offset=8
  end
  local.get $5
  if
   local.get $5
   local.get $4
   i32.store offset=4
  end
  local.get $1
  local.get $0
  local.get $2
  i32.const 4
  i32.shl
  local.get $3
  i32.add
  i32.const 2
  i32.shl
  i32.add
  local.tee $1
  i32.load offset=96
  i32.eq
  if
   local.get $1
   local.get $5
   i32.store offset=96
   local.get $5
   i32.eqz
   if
    local.get $0
    local.get $2
    i32.const 2
    i32.shl
    i32.add
    local.tee $1
    i32.load offset=4
    i32.const -2
    local.get $3
    i32.rotl
    i32.and
    local.set $3
    local.get $1
    local.get $3
    i32.store offset=4
    local.get $3
    i32.eqz
    if
     local.get $0
     local.get $0
     i32.load
     i32.const -2
     local.get $2
     i32.rotl
     i32.and
     i32.store
    end
   end
  end
 )
 (func $~lib/rt/tlsf/insertBlock (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $1
  i32.eqz
  if
   i32.const 0
   i32.const 1600
   i32.const 201
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.load
  local.tee $3
  i32.const 1
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 1600
   i32.const 203
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.const 4
  i32.add
  local.get $1
  i32.load
  i32.const -4
  i32.and
  i32.add
  local.tee $4
  i32.load
  local.tee $2
  i32.const 1
  i32.and
  if
   local.get $0
   local.get $4
   call $~lib/rt/tlsf/removeBlock
   local.get $1
   local.get $3
   i32.const 4
   i32.add
   local.get $2
   i32.const -4
   i32.and
   i32.add
   local.tee $3
   i32.store
   local.get $1
   i32.const 4
   i32.add
   local.get $1
   i32.load
   i32.const -4
   i32.and
   i32.add
   local.tee $4
   i32.load
   local.set $2
  end
  local.get $3
  i32.const 2
  i32.and
  if
   local.get $1
   i32.const 4
   i32.sub
   i32.load
   local.tee $1
   i32.load
   local.tee $6
   i32.const 1
   i32.and
   i32.eqz
   if
    i32.const 0
    i32.const 1600
    i32.const 221
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   local.get $0
   local.get $1
   call $~lib/rt/tlsf/removeBlock
   local.get $1
   local.get $6
   i32.const 4
   i32.add
   local.get $3
   i32.const -4
   i32.and
   i32.add
   local.tee $3
   i32.store
  end
  local.get $4
  local.get $2
  i32.const 2
  i32.or
  i32.store
  local.get $3
  i32.const -4
  i32.and
  local.tee $2
  i32.const 12
  i32.lt_u
  if
   i32.const 0
   i32.const 1600
   i32.const 233
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  local.get $1
  i32.const 4
  i32.add
  local.get $2
  i32.add
  i32.ne
  if
   i32.const 0
   i32.const 1600
   i32.const 234
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  i32.const 4
  i32.sub
  local.get $1
  i32.store
  local.get $2
  i32.const 256
  i32.lt_u
  if (result i32)
   local.get $2
   i32.const 4
   i32.shr_u
  else
   i32.const 31
   i32.const 1073741820
   local.get $2
   local.get $2
   i32.const 1073741820
   i32.ge_u
   select
   local.tee $2
   i32.clz
   i32.sub
   local.tee $3
   i32.const 7
   i32.sub
   local.set $5
   local.get $2
   local.get $3
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
  end
  local.tee $2
  i32.const 16
  i32.lt_u
  local.get $5
  i32.const 23
  i32.lt_u
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 1600
   i32.const 251
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $5
  i32.const 4
  i32.shl
  local.get $2
  i32.add
  i32.const 2
  i32.shl
  i32.add
  i32.load offset=96
  local.set $3
  local.get $1
  i32.const 0
  i32.store offset=4
  local.get $1
  local.get $3
  i32.store offset=8
  local.get $3
  if
   local.get $3
   local.get $1
   i32.store offset=4
  end
  local.get $0
  local.get $5
  i32.const 4
  i32.shl
  local.get $2
  i32.add
  i32.const 2
  i32.shl
  i32.add
  local.get $1
  i32.store offset=96
  local.get $0
  local.get $0
  i32.load
  i32.const 1
  local.get $5
  i32.shl
  i32.or
  i32.store
  local.get $0
  local.get $5
  i32.const 2
  i32.shl
  i32.add
  local.tee $0
  local.get $0
  i32.load offset=4
  i32.const 1
  local.get $2
  i32.shl
  i32.or
  i32.store offset=4
 )
 (func $~lib/rt/tlsf/addMemory (param $0 i32) (param $1 i32) (param $2 i64)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $2
  local.get $1
  i64.extend_i32_u
  i64.lt_u
  if
   i32.const 0
   i32.const 1600
   i32.const 382
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.const 19
  i32.add
  i32.const -16
  i32.and
  i32.const 4
  i32.sub
  local.set $1
  local.get $0
  i32.load offset=1568
  local.tee $3
  if
   local.get $3
   i32.const 4
   i32.add
   local.get $1
   i32.gt_u
   if
    i32.const 0
    i32.const 1600
    i32.const 389
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   local.get $3
   local.get $1
   i32.const 16
   i32.sub
   local.tee $5
   i32.eq
   if
    local.get $3
    i32.load
    local.set $4
    local.get $5
    local.set $1
   end
  else
   local.get $0
   i32.const 1572
   i32.add
   local.get $1
   i32.gt_u
   if
    i32.const 0
    i32.const 1600
    i32.const 402
    i32.const 5
    call $~lib/builtins/abort
    unreachable
   end
  end
  local.get $2
  i32.wrap_i64
  i32.const -16
  i32.and
  local.get $1
  i32.sub
  local.tee $3
  i32.const 20
  i32.lt_u
  if
   return
  end
  local.get $1
  local.get $4
  i32.const 2
  i32.and
  local.get $3
  i32.const 8
  i32.sub
  local.tee $3
  i32.const 1
  i32.or
  i32.or
  i32.store
  local.get $1
  i32.const 0
  i32.store offset=4
  local.get $1
  i32.const 0
  i32.store offset=8
  local.get $1
  i32.const 4
  i32.add
  local.get $3
  i32.add
  local.tee $3
  i32.const 2
  i32.store
  local.get $0
  local.get $3
  i32.store offset=1568
  local.get $0
  local.get $1
  call $~lib/rt/tlsf/insertBlock
 )
 (func $~lib/rt/tlsf/initialize
  (local $0 i32)
  (local $1 i32)
  memory.size
  local.tee $1
  i32.const 0
  i32.le_s
  if (result i32)
   i32.const 1
   local.get $1
   i32.sub
   memory.grow
   i32.const 0
   i32.lt_s
  else
   i32.const 0
  end
  if
   unreachable
  end
  i32.const 57120
  i32.const 0
  i32.store
  i32.const 58688
  i32.const 0
  i32.store
  loop $for-loop|0
   local.get $0
   i32.const 23
   i32.lt_u
   if
    local.get $0
    i32.const 2
    i32.shl
    i32.const 57120
    i32.add
    i32.const 0
    i32.store offset=4
    i32.const 0
    local.set $1
    loop $for-loop|1
     local.get $1
     i32.const 16
     i32.lt_u
     if
      local.get $0
      i32.const 4
      i32.shl
      local.get $1
      i32.add
      i32.const 2
      i32.shl
      i32.const 57120
      i32.add
      i32.const 0
      i32.store offset=96
      local.get $1
      i32.const 1
      i32.add
      local.set $1
      br $for-loop|1
     end
    end
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
  i32.const 57120
  i32.const 58692
  memory.size
  i64.extend_i32_s
  i64.const 16
  i64.shl
  call $~lib/rt/tlsf/addMemory
  i32.const 57120
  global.set $~lib/rt/tlsf/ROOT
 )
 (func $~lib/rt/itcms/step (result i32)
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  block $break|0
   block $case2|0
    block $case1|0
     block $case0|0
      global.get $~lib/rt/itcms/state
      br_table $case0|0 $case1|0 $case2|0 $break|0
     end
     i32.const 1
     global.set $~lib/rt/itcms/state
     i32.const 0
     global.set $~lib/rt/itcms/visitCount
     call $~lib/rt/itcms/visitRoots
     global.get $~lib/rt/itcms/toSpace
     global.set $~lib/rt/itcms/iter
     global.get $~lib/rt/itcms/visitCount
     return
    end
    global.get $~lib/rt/itcms/white
    i32.eqz
    local.set $1
    global.get $~lib/rt/itcms/iter
    i32.load offset=4
    i32.const -4
    i32.and
    local.set $0
    loop $while-continue|1
     local.get $0
     global.get $~lib/rt/itcms/toSpace
     i32.ne
     if
      local.get $0
      global.set $~lib/rt/itcms/iter
      local.get $1
      local.get $0
      i32.load offset=4
      local.tee $2
      i32.const 3
      i32.and
      i32.ne
      if
       local.get $0
       local.get $2
       i32.const -4
       i32.and
       local.get $1
       i32.or
       i32.store offset=4
       i32.const 0
       global.set $~lib/rt/itcms/visitCount
       local.get $0
       i32.const 20
       i32.add
       call $~lib/rt/__visit_members
       global.get $~lib/rt/itcms/visitCount
       return
      end
      local.get $0
      i32.load offset=4
      i32.const -4
      i32.and
      local.set $0
      br $while-continue|1
     end
    end
    i32.const 0
    global.set $~lib/rt/itcms/visitCount
    call $~lib/rt/itcms/visitRoots
    global.get $~lib/rt/itcms/toSpace
    global.get $~lib/rt/itcms/iter
    i32.load offset=4
    i32.const -4
    i32.and
    i32.eq
    if
     global.get $~lib/memory/__stack_pointer
     local.set $0
     loop $while-continue|0
      local.get $0
      i32.const 57116
      i32.lt_u
      if
       local.get $0
       i32.load
       call $~lib/rt/itcms/__visit
       local.get $0
       i32.const 4
       i32.add
       local.set $0
       br $while-continue|0
      end
     end
     global.get $~lib/rt/itcms/iter
     i32.load offset=4
     i32.const -4
     i32.and
     local.set $0
     loop $while-continue|2
      local.get $0
      global.get $~lib/rt/itcms/toSpace
      i32.ne
      if
       local.get $1
       local.get $0
       i32.load offset=4
       local.tee $2
       i32.const 3
       i32.and
       i32.ne
       if
        local.get $0
        local.get $2
        i32.const -4
        i32.and
        local.get $1
        i32.or
        i32.store offset=4
        local.get $0
        i32.const 20
        i32.add
        call $~lib/rt/__visit_members
       end
       local.get $0
       i32.load offset=4
       i32.const -4
       i32.and
       local.set $0
       br $while-continue|2
      end
     end
     global.get $~lib/rt/itcms/fromSpace
     local.set $0
     global.get $~lib/rt/itcms/toSpace
     global.set $~lib/rt/itcms/fromSpace
     local.get $0
     global.set $~lib/rt/itcms/toSpace
     local.get $1
     global.set $~lib/rt/itcms/white
     local.get $0
     i32.load offset=4
     i32.const -4
     i32.and
     global.set $~lib/rt/itcms/iter
     i32.const 2
     global.set $~lib/rt/itcms/state
    end
    global.get $~lib/rt/itcms/visitCount
    return
   end
   global.get $~lib/rt/itcms/iter
   local.tee $0
   global.get $~lib/rt/itcms/toSpace
   i32.ne
   if
    local.get $0
    i32.load offset=4
    local.tee $1
    i32.const -4
    i32.and
    global.set $~lib/rt/itcms/iter
    global.get $~lib/rt/itcms/white
    i32.eqz
    local.get $1
    i32.const 3
    i32.and
    i32.ne
    if
     i32.const 0
     i32.const 1328
     i32.const 229
     i32.const 20
     call $~lib/builtins/abort
     unreachable
    end
    local.get $0
    i32.const 57116
    i32.lt_u
    if
     local.get $0
     i32.const 0
     i32.store offset=4
     local.get $0
     i32.const 0
     i32.store offset=8
    else
     global.get $~lib/rt/itcms/total
     local.get $0
     i32.load
     i32.const -4
     i32.and
     i32.const 4
     i32.add
     i32.sub
     global.set $~lib/rt/itcms/total
     local.get $0
     i32.const 4
     i32.add
     local.tee $0
     i32.const 57116
     i32.ge_u
     if
      global.get $~lib/rt/tlsf/ROOT
      i32.eqz
      if
       call $~lib/rt/tlsf/initialize
      end
      global.get $~lib/rt/tlsf/ROOT
      local.set $1
      local.get $0
      i32.const 4
      i32.sub
      local.set $2
      local.get $0
      i32.const 15
      i32.and
      i32.const 1
      local.get $0
      select
      if (result i32)
       i32.const 1
      else
       local.get $2
       i32.load
       i32.const 1
       i32.and
      end
      if
       i32.const 0
       i32.const 1600
       i32.const 562
       i32.const 3
       call $~lib/builtins/abort
       unreachable
      end
      local.get $2
      local.get $2
      i32.load
      i32.const 1
      i32.or
      i32.store
      local.get $1
      local.get $2
      call $~lib/rt/tlsf/insertBlock
     end
    end
    i32.const 10
    return
   end
   global.get $~lib/rt/itcms/toSpace
   global.get $~lib/rt/itcms/toSpace
   i32.store offset=4
   global.get $~lib/rt/itcms/toSpace
   global.get $~lib/rt/itcms/toSpace
   i32.store offset=8
   i32.const 0
   global.set $~lib/rt/itcms/state
  end
  i32.const 0
 )
 (func $~lib/rt/tlsf/searchBlock (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $1
  i32.const 256
  i32.lt_u
  if
   local.get $1
   i32.const 4
   i32.shr_u
   local.set $1
  else
   local.get $1
   i32.const 536870910
   i32.lt_u
   if
    local.get $1
    i32.const 1
    i32.const 27
    local.get $1
    i32.clz
    i32.sub
    i32.shl
    i32.add
    i32.const 1
    i32.sub
    local.set $1
   end
   local.get $1
   i32.const 31
   local.get $1
   i32.clz
   i32.sub
   local.tee $2
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
   local.set $1
   local.get $2
   i32.const 7
   i32.sub
   local.set $2
  end
  local.get $1
  i32.const 16
  i32.lt_u
  local.get $2
  i32.const 23
  i32.lt_u
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 1600
   i32.const 334
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $2
  i32.const 2
  i32.shl
  i32.add
  i32.load offset=4
  i32.const -1
  local.get $1
  i32.shl
  i32.and
  local.tee $1
  if (result i32)
   local.get $0
   local.get $1
   i32.ctz
   local.get $2
   i32.const 4
   i32.shl
   i32.add
   i32.const 2
   i32.shl
   i32.add
   i32.load offset=96
  else
   local.get $0
   i32.load
   i32.const -1
   local.get $2
   i32.const 1
   i32.add
   i32.shl
   i32.and
   local.tee $1
   if (result i32)
    local.get $0
    local.get $1
    i32.ctz
    local.tee $1
    i32.const 2
    i32.shl
    i32.add
    i32.load offset=4
    local.tee $2
    i32.eqz
    if
     i32.const 0
     i32.const 1600
     i32.const 347
     i32.const 18
     call $~lib/builtins/abort
     unreachable
    end
    local.get $0
    local.get $2
    i32.ctz
    local.get $1
    i32.const 4
    i32.shl
    i32.add
    i32.const 2
    i32.shl
    i32.add
    i32.load offset=96
   else
    i32.const 0
   end
  end
 )
 (func $~lib/rt/itcms/__new (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $0
  i32.const 1073741804
  i32.ge_u
  if
   i32.const 1264
   i32.const 1328
   i32.const 261
   i32.const 31
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/rt/itcms/total
  global.get $~lib/rt/itcms/threshold
  i32.ge_u
  if
   block $__inlined_func$~lib/rt/itcms/interrupt$69
    i32.const 2048
    local.set $2
    loop $do-loop|0
     local.get $2
     call $~lib/rt/itcms/step
     i32.sub
     local.set $2
     global.get $~lib/rt/itcms/state
     i32.eqz
     if
      global.get $~lib/rt/itcms/total
      i64.extend_i32_u
      i64.const 200
      i64.mul
      i64.const 100
      i64.div_u
      i32.wrap_i64
      i32.const 1024
      i32.add
      global.set $~lib/rt/itcms/threshold
      br $__inlined_func$~lib/rt/itcms/interrupt$69
     end
     local.get $2
     i32.const 0
     i32.gt_s
     br_if $do-loop|0
    end
    global.get $~lib/rt/itcms/total
    global.get $~lib/rt/itcms/total
    global.get $~lib/rt/itcms/threshold
    i32.sub
    i32.const 1024
    i32.lt_u
    i32.const 10
    i32.shl
    i32.add
    global.set $~lib/rt/itcms/threshold
   end
  end
  global.get $~lib/rt/tlsf/ROOT
  i32.eqz
  if
   call $~lib/rt/tlsf/initialize
  end
  global.get $~lib/rt/tlsf/ROOT
  local.set $4
  local.get $0
  i32.const 16
  i32.add
  local.tee $2
  i32.const 1073741820
  i32.gt_u
  if
   i32.const 1264
   i32.const 1600
   i32.const 461
   i32.const 29
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  local.get $2
  i32.const 12
  i32.le_u
  if (result i32)
   i32.const 12
  else
   local.get $2
   i32.const 19
   i32.add
   i32.const -16
   i32.and
   i32.const 4
   i32.sub
  end
  local.tee $5
  call $~lib/rt/tlsf/searchBlock
  local.tee $2
  i32.eqz
  if
   memory.size
   local.tee $2
   local.get $5
   i32.const 256
   i32.ge_u
   if (result i32)
    local.get $5
    i32.const 536870910
    i32.lt_u
    if (result i32)
     local.get $5
     i32.const 1
     i32.const 27
     local.get $5
     i32.clz
     i32.sub
     i32.shl
     i32.add
     i32.const 1
     i32.sub
    else
     local.get $5
    end
   else
    local.get $5
   end
   i32.const 4
   local.get $4
   i32.load offset=1568
   local.get $2
   i32.const 16
   i32.shl
   i32.const 4
   i32.sub
   i32.ne
   i32.shl
   i32.add
   i32.const 65535
   i32.add
   i32.const -65536
   i32.and
   i32.const 16
   i32.shr_u
   local.tee $3
   local.get $2
   local.get $3
   i32.gt_s
   select
   memory.grow
   i32.const 0
   i32.lt_s
   if
    local.get $3
    memory.grow
    i32.const 0
    i32.lt_s
    if
     unreachable
    end
   end
   local.get $4
   local.get $2
   i32.const 16
   i32.shl
   memory.size
   i64.extend_i32_s
   i64.const 16
   i64.shl
   call $~lib/rt/tlsf/addMemory
   local.get $4
   local.get $5
   call $~lib/rt/tlsf/searchBlock
   local.tee $2
   i32.eqz
   if
    i32.const 0
    i32.const 1600
    i32.const 499
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
  end
  local.get $5
  local.get $2
  i32.load
  i32.const -4
  i32.and
  i32.gt_u
  if
   i32.const 0
   i32.const 1600
   i32.const 501
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  local.get $2
  call $~lib/rt/tlsf/removeBlock
  local.get $2
  i32.load
  local.set $6
  local.get $5
  i32.const 4
  i32.add
  i32.const 15
  i32.and
  if
   i32.const 0
   i32.const 1600
   i32.const 361
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $6
  i32.const -4
  i32.and
  local.get $5
  i32.sub
  local.tee $3
  i32.const 16
  i32.ge_u
  if
   local.get $2
   local.get $5
   local.get $6
   i32.const 2
   i32.and
   i32.or
   i32.store
   local.get $2
   i32.const 4
   i32.add
   local.get $5
   i32.add
   local.tee $5
   local.get $3
   i32.const 4
   i32.sub
   i32.const 1
   i32.or
   i32.store
   local.get $4
   local.get $5
   call $~lib/rt/tlsf/insertBlock
  else
   local.get $2
   local.get $6
   i32.const -2
   i32.and
   i32.store
   local.get $2
   i32.const 4
   i32.add
   local.get $2
   i32.load
   i32.const -4
   i32.and
   i32.add
   local.tee $3
   local.get $3
   i32.load
   i32.const -3
   i32.and
   i32.store
  end
  local.get $2
  local.get $1
  i32.store offset=12
  local.get $2
  local.get $0
  i32.store offset=16
  global.get $~lib/rt/itcms/fromSpace
  local.tee $1
  i32.load offset=8
  local.set $3
  local.get $2
  local.get $1
  global.get $~lib/rt/itcms/white
  i32.or
  i32.store offset=4
  local.get $2
  local.get $3
  i32.store offset=8
  local.get $3
  local.get $2
  local.get $3
  i32.load offset=4
  i32.const 3
  i32.and
  i32.or
  i32.store offset=4
  local.get $1
  local.get $2
  i32.store offset=8
  global.get $~lib/rt/itcms/total
  local.get $2
  i32.load
  i32.const -4
  i32.and
  i32.const 4
  i32.add
  i32.add
  global.set $~lib/rt/itcms/total
  local.get $2
  i32.const 20
  i32.add
  local.tee $1
  i32.const 0
  local.get $0
  memory.fill
  local.get $1
 )
 (func $~lib/rt/itcms/__link (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  local.get $1
  i32.eqz
  if
   return
  end
  local.get $0
  i32.eqz
  if
   i32.const 0
   i32.const 1328
   i32.const 295
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/rt/itcms/white
  local.get $1
  i32.const 20
  i32.sub
  local.tee $1
  i32.load offset=4
  i32.const 3
  i32.and
  i32.eq
  if
   local.get $0
   i32.const 20
   i32.sub
   local.tee $0
   i32.load offset=4
   i32.const 3
   i32.and
   local.tee $3
   global.get $~lib/rt/itcms/white
   i32.eqz
   i32.eq
   if
    local.get $0
    local.get $1
    local.get $2
    select
    call $~lib/rt/itcms/Object#makeGray
   else
    global.get $~lib/rt/itcms/state
    i32.const 1
    i32.eq
    local.get $3
    i32.const 3
    i32.eq
    i32.and
    if
     local.get $1
     call $~lib/rt/itcms/Object#makeGray
    end
   end
  end
 )
 (func $~lib/math/NativeMath.log (param $0 f64) (result f64)
  (local $1 i64)
  (local $2 i32)
  (local $3 i64)
  (local $4 f64)
  (local $5 f64)
  (local $6 f64)
  (local $7 i32)
  block $~lib/util/math/log_lut|inlined.0 (result f64)
   local.get $0
   i64.reinterpret_f64
   local.tee $1
   i64.const 4606619468846596096
   i64.sub
   i64.const 854320534781952
   i64.lt_u
   if
    local.get $0
    f64.const -1
    f64.add
    local.tee $0
    local.get $0
    f64.mul
    local.tee $4
    local.get $0
    f64.mul
    local.tee $5
    local.get $0
    f64.const -0.24999999999998432
    f64.mul
    f64.const 0.3333333333333352
    f64.add
    local.get $4
    f64.const 0.19999999999320328
    f64.mul
    f64.add
    local.get $5
    local.get $0
    f64.const 0.14285715076560868
    f64.mul
    f64.const -0.16666666669929706
    f64.add
    local.get $4
    f64.const -0.12499997863982555
    f64.mul
    f64.add
    local.get $5
    local.get $0
    f64.const -0.10000486757818193
    f64.mul
    f64.const 0.11110712032936046
    f64.add
    local.get $4
    f64.const 0.09181994006195467
    f64.mul
    f64.add
    local.get $5
    f64.const -0.08328363062289341
    f64.mul
    f64.add
    f64.mul
    f64.add
    f64.mul
    f64.add
    f64.mul
    local.get $0
    local.get $0
    local.get $0
    local.get $0
    f64.const 134217728
    f64.mul
    local.tee $4
    f64.add
    local.get $4
    f64.sub
    local.tee $4
    local.get $4
    f64.mul
    f64.const -0.5
    f64.mul
    local.tee $5
    f64.add
    local.tee $6
    f64.sub
    local.get $5
    f64.add
    local.get $0
    local.get $4
    f64.sub
    f64.const -0.5
    f64.mul
    local.get $4
    local.get $0
    f64.add
    f64.mul
    f64.add
    f64.add
    local.get $6
    f64.add
    br $~lib/util/math/log_lut|inlined.0
   end
   local.get $1
   i64.const 48
   i64.shr_u
   i32.wrap_i64
   local.tee $2
   i32.const 16
   i32.sub
   i32.const 32736
   i32.ge_u
   if
    f64.const -1
    local.get $0
    local.get $0
    f64.mul
    f64.div
    local.get $1
    i64.const 1
    i64.shl
    i64.eqz
    br_if $~lib/util/math/log_lut|inlined.0
    drop
    local.get $0
    local.get $1
    i64.const 9218868437227405312
    i64.eq
    br_if $~lib/util/math/log_lut|inlined.0
    drop
    i32.const 1
    local.get $2
    i32.const 32752
    i32.and
    i32.const 32752
    i32.eq
    local.get $2
    i32.const 32768
    i32.and
    select
    if
     local.get $0
     local.get $0
     f64.sub
     local.tee $0
     local.get $0
     f64.div
     br $~lib/util/math/log_lut|inlined.0
    end
    local.get $0
    f64.const 4503599627370496
    f64.mul
    i64.reinterpret_f64
    i64.const 234187180623265792
    i64.sub
    local.set $1
   end
   local.get $1
   i64.const 4604367669032910848
   i64.sub
   local.tee $3
   i64.const 45
   i64.shr_u
   i64.const 127
   i64.and
   i32.wrap_i64
   i32.const 4
   i32.shl
   local.tee $2
   i32.const 1760
   i32.add
   local.set $7
   local.get $3
   i64.const 52
   i64.shr_s
   f64.convert_i64_s
   local.tee $0
   f64.const 0.6931471805598903
   f64.mul
   local.get $7
   f64.load offset=8
   f64.add
   local.tee $4
   local.get $1
   local.get $3
   i64.const -4503599627370496
   i64.and
   i64.sub
   f64.reinterpret_i64
   local.get $2
   i32.const 3808
   i32.add
   local.tee $2
   f64.load
   f64.sub
   local.get $2
   f64.load offset=8
   f64.sub
   local.get $7
   f64.load
   f64.mul
   local.tee $5
   f64.add
   local.set $6
   local.get $4
   local.get $6
   f64.sub
   local.get $5
   f64.add
   local.get $0
   f64.const 5.497923018708371e-14
   f64.mul
   f64.add
   local.get $5
   local.get $5
   f64.mul
   local.tee $0
   f64.const -0.5000000000000001
   f64.mul
   f64.add
   local.get $5
   local.get $0
   f64.mul
   local.get $5
   f64.const -0.2499999999622955
   f64.mul
   f64.const 0.33333333331825593
   f64.add
   local.get $0
   local.get $5
   f64.const -0.16667054827627667
   f64.mul
   f64.const 0.20000304511814496
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.add
   local.get $6
   f64.add
  end
 )
 (func $~lib/math/NativeMath.mod (param $0 f64) (param $1 f64) (result f64)
  (local $2 i64)
  (local $3 i64)
  (local $4 i64)
  (local $5 i64)
  (local $6 i64)
  (local $7 i64)
  (local $8 i64)
  local.get $1
  f64.abs
  f64.const 1
  f64.eq
  if
   local.get $0
   local.get $0
   f64.trunc
   f64.sub
   local.get $0
   f64.copysign
   return
  end
  local.get $1
  i64.reinterpret_f64
  local.tee $6
  i64.const 52
  i64.shr_u
  i64.const 2047
  i64.and
  local.set $7
  local.get $6
  i64.const 1
  i64.shl
  local.tee $4
  i64.eqz
  local.get $0
  i64.reinterpret_f64
  local.tee $3
  i64.const 52
  i64.shr_u
  i64.const 2047
  i64.and
  local.tee $8
  i64.const 2047
  i64.eq
  i32.or
  local.get $1
  local.get $1
  f64.ne
  i32.or
  if
   local.get $0
   local.get $1
   f64.mul
   local.tee $0
   local.get $0
   f64.div
   return
  end
  local.get $3
  i64.const 1
  i64.shl
  local.tee $2
  local.get $4
  i64.le_u
  if
   local.get $0
   local.get $2
   local.get $4
   i64.ne
   f64.convert_i32_u
   f64.mul
   return
  end
  local.get $3
  i64.const 63
  i64.shr_u
  local.set $5
  local.get $8
  i64.eqz
  if (result i64)
   local.get $3
   i64.const 1
   local.get $8
   local.get $3
   i64.const 12
   i64.shl
   i64.clz
   i64.sub
   local.tee $8
   i64.sub
   i64.shl
  else
   local.get $3
   i64.const 4503599627370495
   i64.and
   i64.const 4503599627370496
   i64.or
  end
  local.set $2
  local.get $7
  i64.eqz
  if (result i64)
   local.get $6
   i64.const 1
   local.get $7
   local.get $6
   i64.const 12
   i64.shl
   i64.clz
   i64.sub
   local.tee $7
   i64.sub
   i64.shl
  else
   local.get $6
   i64.const 4503599627370495
   i64.and
   i64.const 4503599627370496
   i64.or
  end
  local.set $3
  loop $while-continue|0
   local.get $7
   local.get $8
   i64.lt_s
   if
    local.get $2
    local.get $3
    i64.ge_u
    if (result i64)
     local.get $2
     local.get $3
     i64.eq
     if
      local.get $0
      f64.const 0
      f64.mul
      return
     end
     local.get $2
     local.get $3
     i64.sub
    else
     local.get $2
    end
    i64.const 1
    i64.shl
    local.set $2
    local.get $8
    i64.const 1
    i64.sub
    local.set $8
    br $while-continue|0
   end
  end
  local.get $2
  local.get $3
  i64.ge_u
  if
   local.get $2
   local.get $3
   i64.eq
   if
    local.get $0
    f64.const 0
    f64.mul
    return
   end
   local.get $2
   local.get $3
   i64.sub
   local.set $2
  end
  local.get $8
  local.get $2
  i64.const 11
  i64.shl
  i64.clz
  local.tee $4
  i64.sub
  local.set $3
  local.get $2
  local.get $4
  i64.shl
  local.set $2
  local.get $3
  i64.const 0
  i64.gt_s
  if (result i64)
   local.get $2
   i64.const 4503599627370496
   i64.sub
   local.get $3
   i64.const 52
   i64.shl
   i64.or
  else
   local.get $2
   i64.const 1
   local.get $3
   i64.sub
   i64.shr_u
  end
  local.get $5
  i64.const 63
  i64.shl
  i64.or
  f64.reinterpret_i64
 )
 (func $~lib/math/NativeMath.pow (param $0 f64) (param $1 f64) (result f64)
  (local $2 i64)
  (local $3 i32)
  (local $4 i32)
  (local $5 i64)
  (local $6 i64)
  (local $7 f64)
  (local $8 f64)
  (local $9 f64)
  (local $10 f64)
  (local $11 i64)
  (local $12 i64)
  (local $13 f64)
  (local $14 f64)
  (local $15 f64)
  (local $16 f64)
  (local $17 f64)
  (local $18 i32)
  local.get $1
  f64.abs
  f64.const 2
  f64.le
  if
   local.get $1
   f64.const 2
   f64.eq
   if
    local.get $0
    local.get $0
    f64.mul
    return
   end
   local.get $1
   f64.const 0.5
   f64.eq
   if
    local.get $0
    f64.sqrt
    f64.abs
    f64.const inf
    local.get $0
    f64.const -inf
    f64.ne
    select
    return
   end
   local.get $1
   f64.const -1
   f64.eq
   if
    f64.const 1
    local.get $0
    f64.div
    return
   end
   local.get $1
   f64.const 1
   f64.eq
   if
    local.get $0
    return
   end
   local.get $1
   f64.const 0
   f64.eq
   if
    f64.const 1
    return
   end
  end
  block $~lib/util/math/pow_lut|inlined.0 (result f64)
   local.get $1
   i64.reinterpret_f64
   local.tee $11
   i64.const 52
   i64.shr_u
   local.set $6
   local.get $0
   i64.reinterpret_f64
   local.tee $2
   i64.const 52
   i64.shr_u
   local.tee $5
   i64.const 1
   i64.sub
   i64.const 2046
   i64.ge_u
   if (result i32)
    i32.const 1
   else
    local.get $6
    i64.const 2047
    i64.and
    i64.const 958
    i64.sub
    i64.const 128
    i64.ge_u
   end
   if
    local.get $11
    i64.const 1
    i64.shl
    local.tee $12
    i64.const 1
    i64.sub
    i64.const -9007199254740993
    i64.ge_u
    if
     f64.const 1
     local.get $12
     i64.eqz
     br_if $~lib/util/math/pow_lut|inlined.0
     drop
     f64.const nan:0x8000000000000
     local.get $2
     i64.const 4607182418800017408
     i64.eq
     br_if $~lib/util/math/pow_lut|inlined.0
     drop
     local.get $0
     local.get $1
     f64.add
     local.get $12
     i64.const -9007199254740992
     i64.gt_u
     local.get $2
     i64.const 1
     i64.shl
     local.tee $2
     i64.const -9007199254740992
     i64.gt_u
     i32.or
     br_if $~lib/util/math/pow_lut|inlined.0
     drop
     f64.const nan:0x8000000000000
     local.get $2
     i64.const 9214364837600034816
     i64.eq
     br_if $~lib/util/math/pow_lut|inlined.0
     drop
     f64.const 0
     local.get $11
     i64.const 63
     i64.shr_u
     i64.eqz
     local.get $2
     i64.const 9214364837600034816
     i64.lt_u
     i32.eq
     br_if $~lib/util/math/pow_lut|inlined.0
     drop
     local.get $1
     local.get $1
     f64.mul
     br $~lib/util/math/pow_lut|inlined.0
    end
    local.get $2
    i64.const 1
    i64.shl
    i64.const 1
    i64.sub
    i64.const -9007199254740993
    i64.ge_u
    if
     f64.const 1
     local.get $0
     local.get $0
     f64.mul
     local.tee $0
     f64.neg
     local.get $0
     local.get $2
     i64.const 63
     i64.shr_u
     i32.wrap_i64
     if (result i32)
      block $~lib/util/math/checkint|inlined.0 (result i32)
       i32.const 0
       local.get $11
       i64.const 52
       i64.shr_u
       i64.const 2047
       i64.and
       local.tee $2
       i64.const 1023
       i64.lt_u
       br_if $~lib/util/math/checkint|inlined.0
       drop
       i32.const 2
       local.get $2
       i64.const 1075
       i64.gt_u
       br_if $~lib/util/math/checkint|inlined.0
       drop
       i32.const 0
       local.get $11
       i64.const 1
       i64.const 1075
       local.get $2
       i64.sub
       i64.shl
       local.tee $2
       i64.const 1
       i64.sub
       i64.and
       i64.const 0
       i64.ne
       br_if $~lib/util/math/checkint|inlined.0
       drop
       i32.const 1
       local.get $2
       local.get $11
       i64.and
       i64.const 0
       i64.ne
       br_if $~lib/util/math/checkint|inlined.0
       drop
       i32.const 2
      end
      i32.const 1
      i32.eq
     else
      i32.const 0
     end
     select
     local.tee $0
     f64.div
     local.get $0
     local.get $11
     i64.const 0
     i64.lt_s
     select
     br $~lib/util/math/pow_lut|inlined.0
    end
    local.get $2
    i64.const 0
    i64.lt_s
    if
     block $~lib/util/math/checkint|inlined.1 (result i32)
      i32.const 0
      local.get $11
      i64.const 52
      i64.shr_u
      i64.const 2047
      i64.and
      local.tee $12
      i64.const 1023
      i64.lt_u
      br_if $~lib/util/math/checkint|inlined.1
      drop
      i32.const 2
      local.get $12
      i64.const 1075
      i64.gt_u
      br_if $~lib/util/math/checkint|inlined.1
      drop
      i32.const 0
      local.get $11
      i64.const 1
      i64.const 1075
      local.get $12
      i64.sub
      i64.shl
      local.tee $12
      i64.const 1
      i64.sub
      i64.and
      i64.const 0
      i64.ne
      br_if $~lib/util/math/checkint|inlined.1
      drop
      i32.const 1
      local.get $11
      local.get $12
      i64.and
      i64.const 0
      i64.ne
      br_if $~lib/util/math/checkint|inlined.1
      drop
      i32.const 2
     end
     local.tee $3
     i32.eqz
     if
      local.get $0
      local.get $0
      f64.sub
      local.tee $0
      local.get $0
      f64.div
      br $~lib/util/math/pow_lut|inlined.0
     end
     local.get $5
     i64.const 2047
     i64.and
     local.set $5
     i32.const 262144
     i32.const 0
     local.get $3
     i32.const 1
     i32.eq
     select
     local.set $4
     local.get $2
     i64.const 9223372036854775807
     i64.and
     local.set $2
    end
    local.get $6
    i64.const 2047
    i64.and
    local.tee $12
    i64.const 958
    i64.sub
    i64.const 128
    i64.ge_u
    if
     f64.const 1
     local.get $2
     i64.const 4607182418800017408
     i64.eq
     br_if $~lib/util/math/pow_lut|inlined.0
     drop
     f64.const 1
     local.get $12
     i64.const 958
     i64.lt_u
     br_if $~lib/util/math/pow_lut|inlined.0
     drop
     f64.const inf
     f64.const 0
     local.get $6
     i64.const 2048
     i64.lt_u
     local.get $2
     i64.const 4607182418800017408
     i64.gt_u
     i32.eq
     select
     br $~lib/util/math/pow_lut|inlined.0
    end
    local.get $5
    i64.eqz
    if
     local.get $0
     f64.const 4503599627370496
     f64.mul
     i64.reinterpret_f64
     i64.const 9223372036854775807
     i64.and
     i64.const 234187180623265792
     i64.sub
     local.set $2
    end
   end
   local.get $2
   local.get $2
   i64.const 4604531861337669632
   i64.sub
   local.tee $2
   i64.const -4503599627370496
   i64.and
   i64.sub
   local.tee $5
   i64.const 2147483648
   i64.add
   i64.const -4294967296
   i64.and
   f64.reinterpret_i64
   local.tee $7
   local.get $2
   i64.const 45
   i64.shr_u
   i64.const 127
   i64.and
   i32.wrap_i64
   i32.const 5
   i32.shl
   i32.const 6176
   i32.add
   local.tee $3
   f64.load
   local.tee $8
   f64.mul
   f64.const -1
   f64.add
   local.set $9
   local.get $2
   i64.const 52
   i64.shr_s
   f64.convert_i64_s
   local.tee $13
   f64.const 0.6931471805598903
   f64.mul
   local.get $3
   f64.load offset=16
   f64.add
   local.tee $0
   local.get $9
   local.get $5
   f64.reinterpret_i64
   local.get $7
   f64.sub
   local.get $8
   f64.mul
   local.tee $7
   f64.add
   local.tee $14
   f64.add
   local.set $15
   local.get $14
   local.get $14
   f64.const -0.5
   f64.mul
   local.tee $8
   f64.mul
   local.set $16
   local.get $15
   local.get $9
   local.get $9
   f64.const -0.5
   f64.mul
   local.tee $17
   f64.mul
   local.tee $9
   f64.add
   local.tee $10
   local.get $10
   local.get $13
   f64.const 5.497923018708371e-14
   f64.mul
   local.get $3
   f64.load offset=24
   f64.add
   local.get $0
   local.get $15
   f64.sub
   local.get $14
   f64.add
   f64.add
   local.get $7
   local.get $8
   local.get $17
   f64.add
   f64.mul
   f64.add
   local.get $15
   local.get $10
   f64.sub
   local.get $9
   f64.add
   f64.add
   local.get $14
   local.get $16
   f64.mul
   local.get $14
   f64.const 0.5000000000000007
   f64.mul
   f64.const -0.6666666666666679
   f64.add
   local.get $16
   local.get $14
   f64.const -0.6666666663487739
   f64.mul
   f64.const 0.7999999995323976
   f64.add
   local.get $16
   local.get $14
   f64.const 1.0000415263675542
   f64.mul
   f64.const -1.142909628459501
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.add
   local.tee $0
   f64.add
   local.tee $7
   f64.sub
   local.get $0
   f64.add
   global.set $~lib/util/math/log_tail
   block $~lib/util/math/exp_inline|inlined.0 (result f64)
    local.get $11
    i64.const -134217728
    i64.and
    f64.reinterpret_i64
    local.tee $0
    local.get $7
    i64.reinterpret_f64
    i64.const -134217728
    i64.and
    f64.reinterpret_i64
    local.tee $8
    f64.mul
    local.tee $9
    i64.reinterpret_f64
    local.tee $2
    i64.const 52
    i64.shr_u
    i32.wrap_i64
    i32.const 2047
    i32.and
    local.tee $3
    i32.const 969
    i32.sub
    local.tee $18
    i32.const 63
    i32.ge_u
    if
     f64.const -1
     f64.const 1
     local.get $4
     select
     local.get $18
     i32.const -2147483648
     i32.ge_u
     br_if $~lib/util/math/exp_inline|inlined.0
     drop
     f64.const -0
     f64.const 0
     local.get $4
     select
     f64.const -inf
     f64.const inf
     local.get $4
     select
     local.get $2
     i64.const 0
     i64.lt_s
     select
     local.get $3
     i32.const 1033
     i32.ge_u
     br_if $~lib/util/math/exp_inline|inlined.0
     drop
     i32.const 0
     local.set $3
    end
    local.get $9
    f64.const 184.6649652337873
    f64.mul
    f64.const 6755399441055744
    f64.add
    local.tee $10
    i64.reinterpret_f64
    local.tee $2
    i64.const 127
    i64.and
    i64.const 1
    i64.shl
    i32.wrap_i64
    i32.const 3
    i32.shl
    i32.const 10272
    i32.add
    local.tee $18
    i64.load offset=8
    local.get $2
    local.get $4
    i64.extend_i32_u
    i64.add
    i64.const 45
    i64.shl
    i64.add
    local.set $5
    local.get $9
    local.get $10
    f64.const -6755399441055744
    f64.add
    local.tee $9
    f64.const -0.005415212348111709
    f64.mul
    f64.add
    local.get $9
    f64.const -1.2864023111638346e-14
    f64.mul
    f64.add
    local.get $1
    local.get $0
    f64.sub
    local.get $8
    f64.mul
    local.get $1
    local.get $7
    local.get $8
    f64.sub
    global.get $~lib/util/math/log_tail
    f64.add
    f64.mul
    f64.add
    f64.add
    local.tee $0
    local.get $0
    f64.mul
    local.set $1
    local.get $18
    f64.load
    local.get $0
    f64.add
    local.get $1
    local.get $0
    f64.const 0.16666666666665886
    f64.mul
    f64.const 0.49999999999996786
    f64.add
    f64.mul
    f64.add
    local.get $1
    local.get $1
    f64.mul
    local.get $0
    f64.const 0.008333335853059549
    f64.mul
    f64.const 0.0416666808410674
    f64.add
    f64.mul
    f64.add
    local.set $0
    local.get $3
    i32.eqz
    if
     block $~lib/util/math/specialcase|inlined.0 (result f64)
      local.get $2
      i64.const 2147483648
      i64.and
      i64.eqz
      if
       local.get $5
       i64.const 4544132024016830464
       i64.sub
       f64.reinterpret_i64
       local.tee $1
       local.get $1
       local.get $0
       f64.mul
       f64.add
       f64.const 5486124068793688683255936e279
       f64.mul
       br $~lib/util/math/specialcase|inlined.0
      end
      local.get $5
      i64.const 4602678819172646912
      i64.add
      local.tee $2
      f64.reinterpret_i64
      local.tee $1
      local.get $0
      f64.mul
      local.set $0
      local.get $1
      local.get $0
      f64.add
      local.tee $7
      f64.abs
      f64.const 1
      f64.lt
      if (result f64)
       f64.const 1
       local.get $7
       f64.copysign
       local.tee $8
       local.get $7
       f64.add
       local.tee $9
       local.get $8
       local.get $9
       f64.sub
       local.get $7
       f64.add
       local.get $1
       local.get $7
       f64.sub
       local.get $0
       f64.add
       f64.add
       f64.add
       local.get $8
       f64.sub
       local.tee $0
       f64.const 0
       f64.eq
       if (result f64)
        local.get $2
        i64.const -9223372036854775808
        i64.and
        f64.reinterpret_i64
       else
        local.get $0
       end
      else
       local.get $7
      end
      f64.const 2.2250738585072014e-308
      f64.mul
     end
     br $~lib/util/math/exp_inline|inlined.0
    end
    local.get $5
    f64.reinterpret_i64
    local.tee $1
    local.get $1
    local.get $0
    f64.mul
    f64.add
   end
  end
 )
 (func $~lib/util/number/genDigits (param $0 i64) (param $1 i64) (param $2 i32) (param $3 i64) (param $4 i32) (result i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i64)
  (local $8 i32)
  (local $9 i64)
  (local $10 i64)
  (local $11 i32)
  (local $12 i64)
  local.get $1
  local.get $0
  i64.sub
  local.set $10
  i64.const 1
  i32.const 0
  local.get $2
  i32.sub
  local.tee $11
  i64.extend_i32_s
  local.tee $0
  i64.shl
  local.tee $7
  i64.const 1
  i64.sub
  local.tee $12
  local.get $1
  i64.and
  local.set $9
  local.get $1
  local.get $0
  i64.shr_u
  i32.wrap_i64
  local.tee $5
  i32.const 100000
  i32.lt_u
  if (result i32)
   local.get $5
   i32.const 100
   i32.lt_u
   if (result i32)
    local.get $5
    i32.const 10
    i32.ge_u
    i32.const 1
    i32.add
   else
    local.get $5
    i32.const 10000
    i32.ge_u
    i32.const 3
    i32.add
    local.get $5
    i32.const 1000
    i32.ge_u
    i32.add
   end
  else
   local.get $5
   i32.const 10000000
   i32.lt_u
   if (result i32)
    local.get $5
    i32.const 1000000
    i32.ge_u
    i32.const 6
    i32.add
   else
    local.get $5
    i32.const 1000000000
    i32.ge_u
    i32.const 8
    i32.add
    local.get $5
    i32.const 100000000
    i32.ge_u
    i32.add
   end
  end
  local.set $8
  loop $while-continue|0
   local.get $8
   i32.const 0
   i32.gt_s
   if
    block $break|1
     block $case10|1
      block $case9|1
       block $case8|1
        block $case7|1
         block $case6|1
          block $case5|1
           block $case4|1
            block $case3|1
             block $case2|1
              block $case1|1
               block $case0|1
                local.get $8
                i32.const 1
                i32.sub
                br_table $case9|1 $case8|1 $case7|1 $case6|1 $case5|1 $case4|1 $case3|1 $case2|1 $case1|1 $case0|1 $case10|1
               end
               local.get $5
               i32.const 1000000000
               i32.div_u
               local.set $6
               local.get $5
               i32.const 1000000000
               i32.rem_u
               local.set $5
               br $break|1
              end
              local.get $5
              i32.const 100000000
              i32.div_u
              local.set $6
              local.get $5
              i32.const 100000000
              i32.rem_u
              local.set $5
              br $break|1
             end
             local.get $5
             i32.const 10000000
             i32.div_u
             local.set $6
             local.get $5
             i32.const 10000000
             i32.rem_u
             local.set $5
             br $break|1
            end
            local.get $5
            i32.const 1000000
            i32.div_u
            local.set $6
            local.get $5
            i32.const 1000000
            i32.rem_u
            local.set $5
            br $break|1
           end
           local.get $5
           i32.const 100000
           i32.div_u
           local.set $6
           local.get $5
           i32.const 100000
           i32.rem_u
           local.set $5
           br $break|1
          end
          local.get $5
          i32.const 10000
          i32.div_u
          local.set $6
          local.get $5
          i32.const 10000
          i32.rem_u
          local.set $5
          br $break|1
         end
         local.get $5
         i32.const 1000
         i32.div_u
         local.set $6
         local.get $5
         i32.const 1000
         i32.rem_u
         local.set $5
         br $break|1
        end
        local.get $5
        i32.const 100
        i32.div_u
        local.set $6
        local.get $5
        i32.const 100
        i32.rem_u
        local.set $5
        br $break|1
       end
       local.get $5
       i32.const 10
       i32.div_u
       local.set $6
       local.get $5
       i32.const 10
       i32.rem_u
       local.set $5
       br $break|1
      end
      local.get $5
      local.set $6
      i32.const 0
      local.set $5
      br $break|1
     end
     i32.const 0
     local.set $6
    end
    local.get $4
    local.get $6
    i32.or
    if
     local.get $4
     local.tee $2
     i32.const 1
     i32.add
     local.set $4
     local.get $2
     i32.const 1
     i32.shl
     i32.const 12496
     i32.add
     local.get $6
     i32.const 65535
     i32.and
     i32.const 48
     i32.add
     i32.store16
    end
    local.get $8
    i32.const 1
    i32.sub
    local.set $8
    local.get $3
    local.get $5
    i64.extend_i32_u
    local.get $11
    i64.extend_i32_s
    local.tee $1
    i64.shl
    local.get $9
    i64.add
    local.tee $0
    i64.ge_u
    if
     global.get $~lib/util/number/_K
     local.get $8
     i32.add
     global.set $~lib/util/number/_K
     local.get $8
     i32.const 2
     i32.shl
     i32.const 13424
     i32.add
     i64.load32_u
     local.get $1
     i64.shl
     local.set $7
     local.get $4
     i32.const 1
     i32.shl
     i32.const 12494
     i32.add
     local.tee $2
     i32.load16_u
     local.set $6
     loop $while-continue|3
      local.get $0
      local.get $10
      i64.lt_u
      local.get $3
      local.get $0
      i64.sub
      local.get $7
      i64.ge_u
      i32.and
      if (result i32)
       local.get $10
       local.get $0
       local.get $7
       i64.add
       local.tee $1
       i64.gt_u
       local.get $10
       local.get $0
       i64.sub
       local.get $1
       local.get $10
       i64.sub
       i64.gt_u
       i32.or
      else
       i32.const 0
      end
      if
       local.get $6
       i32.const 1
       i32.sub
       local.set $6
       local.get $0
       local.get $7
       i64.add
       local.set $0
       br $while-continue|3
      end
     end
     local.get $2
     local.get $6
     i32.store16
     local.get $4
     return
    end
    br $while-continue|0
   end
  end
  loop $while-continue|4
   local.get $3
   i64.const 10
   i64.mul
   local.set $3
   local.get $9
   i64.const 10
   i64.mul
   local.tee $1
   local.get $11
   i64.extend_i32_s
   i64.shr_u
   local.tee $0
   local.get $4
   i64.extend_i32_s
   i64.or
   i64.const 0
   i64.ne
   if
    local.get $4
    local.tee $2
    i32.const 1
    i32.add
    local.set $4
    local.get $2
    i32.const 1
    i32.shl
    i32.const 12496
    i32.add
    local.get $0
    i32.wrap_i64
    i32.const 65535
    i32.and
    i32.const 48
    i32.add
    i32.store16
   end
   local.get $8
   i32.const 1
   i32.sub
   local.set $8
   local.get $1
   local.get $12
   i64.and
   local.tee $9
   local.get $3
   i64.ge_u
   br_if $while-continue|4
  end
  global.get $~lib/util/number/_K
  local.get $8
  i32.add
  global.set $~lib/util/number/_K
  local.get $10
  i32.const 0
  local.get $8
  i32.sub
  i32.const 2
  i32.shl
  i32.const 13424
  i32.add
  i64.load32_u
  i64.mul
  local.set $1
  local.get $4
  i32.const 1
  i32.shl
  i32.const 12494
  i32.add
  local.tee $2
  i32.load16_u
  local.set $6
  loop $while-continue|6
   local.get $1
   local.get $9
   i64.gt_u
   local.get $3
   local.get $9
   i64.sub
   local.get $7
   i64.ge_u
   i32.and
   if (result i32)
    local.get $1
    local.get $7
    local.get $9
    i64.add
    local.tee $0
    i64.gt_u
    local.get $1
    local.get $9
    i64.sub
    local.get $0
    local.get $1
    i64.sub
    i64.gt_u
    i32.or
   else
    i32.const 0
   end
   if
    local.get $6
    i32.const 1
    i32.sub
    local.set $6
    local.get $7
    local.get $9
    i64.add
    local.set $9
    br $while-continue|6
   end
  end
  local.get $2
  local.get $6
  i32.store16
  local.get $4
 )
 (func $~lib/util/number/utoa32_dec_lut (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  loop $while-continue|0
   local.get $1
   i32.const 10000
   i32.ge_u
   if
    local.get $1
    i32.const 10000
    i32.rem_u
    local.set $3
    local.get $1
    i32.const 10000
    i32.div_u
    local.set $1
    local.get $0
    local.get $2
    i32.const 4
    i32.sub
    local.tee $2
    i32.const 1
    i32.shl
    i32.add
    local.get $3
    i32.const 100
    i32.div_u
    i32.const 2
    i32.shl
    i32.const 13464
    i32.add
    i64.load32_u
    local.get $3
    i32.const 100
    i32.rem_u
    i32.const 2
    i32.shl
    i32.const 13464
    i32.add
    i64.load32_u
    i64.const 32
    i64.shl
    i64.or
    i64.store
    br $while-continue|0
   end
  end
  local.get $1
  i32.const 100
  i32.ge_u
  if
   local.get $0
   local.get $2
   i32.const 2
   i32.sub
   local.tee $2
   i32.const 1
   i32.shl
   i32.add
   local.get $1
   i32.const 100
   i32.rem_u
   i32.const 2
   i32.shl
   i32.const 13464
   i32.add
   i32.load
   i32.store
   local.get $1
   i32.const 100
   i32.div_u
   local.set $1
  end
  local.get $1
  i32.const 10
  i32.ge_u
  if
   local.get $0
   local.get $2
   i32.const 2
   i32.sub
   i32.const 1
   i32.shl
   i32.add
   local.get $1
   i32.const 2
   i32.shl
   i32.const 13464
   i32.add
   i32.load
   i32.store
  else
   local.get $0
   local.get $2
   i32.const 1
   i32.sub
   i32.const 1
   i32.shl
   i32.add
   local.get $1
   i32.const 48
   i32.add
   i32.store16
  end
 )
 (func $~lib/util/number/prettify (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  local.get $2
  i32.eqz
  if
   local.get $0
   local.get $1
   i32.const 1
   i32.shl
   i32.add
   i32.const 3145774
   i32.store
   local.get $1
   i32.const 2
   i32.add
   return
  end
  local.get $1
  local.get $2
  i32.add
  local.tee $3
  i32.const 21
  i32.le_s
  local.get $1
  local.get $3
  i32.le_s
  i32.and
  if (result i32)
   loop $for-loop|0
    local.get $1
    local.get $3
    i32.lt_s
    if
     local.get $0
     local.get $1
     i32.const 1
     i32.shl
     i32.add
     i32.const 48
     i32.store16
     local.get $1
     i32.const 1
     i32.add
     local.set $1
     br $for-loop|0
    end
   end
   local.get $0
   local.get $3
   i32.const 1
   i32.shl
   i32.add
   i32.const 3145774
   i32.store
   local.get $3
   i32.const 2
   i32.add
  else
   local.get $3
   i32.const 21
   i32.le_s
   local.get $3
   i32.const 0
   i32.gt_s
   i32.and
   if (result i32)
    local.get $0
    local.get $3
    i32.const 1
    i32.shl
    i32.add
    local.tee $0
    i32.const 2
    i32.add
    local.get $0
    i32.const 0
    local.get $2
    i32.sub
    i32.const 1
    i32.shl
    memory.copy
    local.get $0
    i32.const 46
    i32.store16
    local.get $1
    i32.const 1
    i32.add
   else
    local.get $3
    i32.const 0
    i32.le_s
    local.get $3
    i32.const -6
    i32.gt_s
    i32.and
    if (result i32)
     local.get $0
     i32.const 2
     local.get $3
     i32.sub
     local.tee $3
     i32.const 1
     i32.shl
     i32.add
     local.get $0
     local.get $1
     i32.const 1
     i32.shl
     memory.copy
     local.get $0
     i32.const 3014704
     i32.store
     i32.const 2
     local.set $2
     loop $for-loop|1
      local.get $2
      local.get $3
      i32.lt_s
      if
       local.get $0
       local.get $2
       i32.const 1
       i32.shl
       i32.add
       i32.const 48
       i32.store16
       local.get $2
       i32.const 1
       i32.add
       local.set $2
       br $for-loop|1
      end
     end
     local.get $1
     local.get $3
     i32.add
    else
     local.get $1
     i32.const 1
     i32.eq
     if
      local.get $0
      i32.const 101
      i32.store16 offset=2
      local.get $0
      i32.const 4
      i32.add
      local.tee $2
      local.get $3
      i32.const 1
      i32.sub
      local.tee $0
      i32.const 0
      i32.lt_s
      local.tee $3
      if
       i32.const 0
       local.get $0
       i32.sub
       local.set $0
      end
      local.get $0
      local.get $0
      i32.const 100000
      i32.lt_u
      if (result i32)
       local.get $0
       i32.const 100
       i32.lt_u
       if (result i32)
        local.get $0
        i32.const 10
        i32.ge_u
        i32.const 1
        i32.add
       else
        local.get $0
        i32.const 10000
        i32.ge_u
        i32.const 3
        i32.add
        local.get $0
        i32.const 1000
        i32.ge_u
        i32.add
       end
      else
       local.get $0
       i32.const 10000000
       i32.lt_u
       if (result i32)
        local.get $0
        i32.const 1000000
        i32.ge_u
        i32.const 6
        i32.add
       else
        local.get $0
        i32.const 1000000000
        i32.ge_u
        i32.const 8
        i32.add
        local.get $0
        i32.const 100000000
        i32.ge_u
        i32.add
       end
      end
      i32.const 1
      i32.add
      local.tee $1
      call $~lib/util/number/utoa32_dec_lut
      local.get $2
      i32.const 45
      i32.const 43
      local.get $3
      select
      i32.store16
     else
      local.get $0
      i32.const 4
      i32.add
      local.get $0
      i32.const 2
      i32.add
      local.get $1
      i32.const 1
      i32.shl
      local.tee $2
      i32.const 2
      i32.sub
      memory.copy
      local.get $0
      i32.const 46
      i32.store16 offset=2
      local.get $0
      local.get $2
      i32.add
      local.tee $0
      i32.const 101
      i32.store16 offset=2
      local.get $0
      i32.const 4
      i32.add
      local.tee $4
      local.get $3
      i32.const 1
      i32.sub
      local.tee $0
      i32.const 0
      i32.lt_s
      local.tee $2
      if
       i32.const 0
       local.get $0
       i32.sub
       local.set $0
      end
      local.get $0
      local.get $0
      i32.const 100000
      i32.lt_u
      if (result i32)
       local.get $0
       i32.const 100
       i32.lt_u
       if (result i32)
        local.get $0
        i32.const 10
        i32.ge_u
        i32.const 1
        i32.add
       else
        local.get $0
        i32.const 10000
        i32.ge_u
        i32.const 3
        i32.add
        local.get $0
        i32.const 1000
        i32.ge_u
        i32.add
       end
      else
       local.get $0
       i32.const 10000000
       i32.lt_u
       if (result i32)
        local.get $0
        i32.const 1000000
        i32.ge_u
        i32.const 6
        i32.add
       else
        local.get $0
        i32.const 1000000000
        i32.ge_u
        i32.const 8
        i32.add
        local.get $0
        i32.const 100000000
        i32.ge_u
        i32.add
       end
      end
      i32.const 1
      i32.add
      local.tee $0
      call $~lib/util/number/utoa32_dec_lut
      local.get $4
      i32.const 45
      i32.const 43
      local.get $2
      select
      i32.store16
      local.get $0
      local.get $1
      i32.add
      local.set $1
     end
     local.get $1
     i32.const 2
     i32.add
    end
   end
  end
 )
 (func $~lib/util/number/dtoa_core (param $0 f64) (result i32)
  (local $1 i64)
  (local $2 i32)
  (local $3 i64)
  (local $4 i32)
  (local $5 i64)
  (local $6 i64)
  (local $7 i64)
  (local $8 i32)
  (local $9 i32)
  (local $10 i64)
  (local $11 i64)
  (local $12 i64)
  (local $13 i64)
  (local $14 i64)
  local.get $0
  f64.const 0
  f64.lt
  local.tee $2
  if (result f64)
   i32.const 12496
   i32.const 45
   i32.store16
   local.get $0
   f64.neg
  else
   local.get $0
  end
  i64.reinterpret_f64
  local.tee $1
  i64.const 9218868437227405312
  i64.and
  i64.const 52
  i64.shr_u
  i32.wrap_i64
  local.tee $4
  i32.const 1
  local.get $4
  select
  i32.const 1075
  i32.sub
  local.tee $8
  i32.const 1
  i32.sub
  local.get $1
  i64.const 4503599627370495
  i64.and
  local.get $4
  i32.const 0
  i32.ne
  i64.extend_i32_u
  i64.const 52
  i64.shl
  i64.add
  local.tee $1
  i64.const 1
  i64.shl
  i64.const 1
  i64.add
  local.tee $3
  i64.clz
  i32.wrap_i64
  local.tee $9
  i32.sub
  local.set $4
  local.get $3
  local.get $9
  i64.extend_i32_s
  i64.shl
  global.set $~lib/util/number/_frc_plus
  local.get $1
  local.get $1
  i64.const 4503599627370496
  i64.eq
  i32.const 1
  i32.add
  local.tee $9
  i64.extend_i32_s
  i64.shl
  i64.const 1
  i64.sub
  local.get $8
  local.get $9
  i32.sub
  local.get $4
  i32.sub
  i64.extend_i32_s
  i64.shl
  global.set $~lib/util/number/_frc_minus
  local.get $4
  global.set $~lib/util/number/_exp
  i32.const 348
  i32.const -61
  global.get $~lib/util/number/_exp
  i32.sub
  f64.convert_i32_s
  f64.const 0.30102999566398114
  f64.mul
  f64.const 347
  f64.add
  local.tee $0
  i32.trunc_sat_f64_s
  local.tee $4
  local.get $4
  f64.convert_i32_s
  local.get $0
  f64.ne
  i32.add
  i32.const 3
  i32.shr_s
  i32.const 1
  i32.add
  local.tee $4
  i32.const 3
  i32.shl
  local.tee $8
  i32.sub
  global.set $~lib/util/number/_K
  local.get $8
  i32.const 12552
  i32.add
  i64.load
  global.set $~lib/util/number/_frc_pow
  local.get $4
  i32.const 1
  i32.shl
  i32.const 13248
  i32.add
  i32.load16_s
  global.set $~lib/util/number/_exp_pow
  local.get $1
  local.get $1
  i64.clz
  i64.shl
  local.tee $1
  i64.const 4294967295
  i64.and
  local.set $5
  global.get $~lib/util/number/_frc_pow
  local.tee $10
  i64.const 4294967295
  i64.and
  local.tee $11
  local.get $1
  i64.const 32
  i64.shr_u
  local.tee $1
  i64.mul
  local.get $5
  local.get $11
  i64.mul
  i64.const 32
  i64.shr_u
  i64.add
  local.set $6
  global.get $~lib/util/number/_frc_plus
  local.tee $3
  i64.const 4294967295
  i64.and
  local.set $12
  local.get $3
  i64.const 32
  i64.shr_u
  local.tee $3
  local.get $11
  i64.mul
  local.get $11
  local.get $12
  i64.mul
  i64.const 32
  i64.shr_u
  i64.add
  local.set $7
  global.get $~lib/util/number/_frc_minus
  local.tee $13
  i64.const 4294967295
  i64.and
  local.set $14
  local.get $13
  i64.const 32
  i64.shr_u
  local.tee $13
  local.get $11
  i64.mul
  local.get $11
  local.get $14
  i64.mul
  i64.const 32
  i64.shr_u
  i64.add
  local.set $11
  local.get $2
  i32.const 1
  i32.shl
  i32.const 12496
  i32.add
  local.get $1
  local.get $10
  i64.const 32
  i64.shr_u
  local.tee $1
  i64.mul
  local.get $6
  i64.const 32
  i64.shr_u
  i64.add
  local.get $1
  local.get $5
  i64.mul
  local.get $6
  i64.const 4294967295
  i64.and
  i64.add
  i64.const 2147483647
  i64.add
  i64.const 32
  i64.shr_u
  i64.add
  local.get $1
  local.get $3
  i64.mul
  local.get $7
  i64.const 32
  i64.shr_u
  i64.add
  local.get $1
  local.get $12
  i64.mul
  local.get $7
  i64.const 4294967295
  i64.and
  i64.add
  i64.const 2147483647
  i64.add
  i64.const 32
  i64.shr_u
  i64.add
  i64.const 1
  i64.sub
  local.tee $3
  global.get $~lib/util/number/_exp_pow
  global.get $~lib/util/number/_exp
  i32.add
  i32.const -64
  i32.sub
  local.get $3
  local.get $1
  local.get $13
  i64.mul
  local.get $11
  i64.const 32
  i64.shr_u
  i64.add
  local.get $1
  local.get $14
  i64.mul
  local.get $11
  i64.const 4294967295
  i64.and
  i64.add
  i64.const 2147483647
  i64.add
  i64.const 32
  i64.shr_u
  i64.add
  i64.const 1
  i64.add
  i64.sub
  local.get $2
  call $~lib/util/number/genDigits
  local.get $2
  i32.sub
  global.get $~lib/util/number/_K
  call $~lib/util/number/prettify
  local.get $2
  i32.add
 )
 (func $~lib/number/F64#toString (param $0 f64) (result i32)
  (local $1 i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  i32.const 12352
  local.set $1
  block $~lib/util/number/dtoa_impl|inlined.0
   local.get $0
   f64.const 0
   f64.eq
   br_if $~lib/util/number/dtoa_impl|inlined.0
   local.get $0
   local.get $0
   f64.sub
   f64.const 0
   f64.ne
   if
    i32.const 12384
    local.set $1
    local.get $0
    local.get $0
    f64.ne
    br_if $~lib/util/number/dtoa_impl|inlined.0
    i32.const 12416
    i32.const 12464
    local.get $0
    f64.const 0
    f64.lt
    select
    local.set $1
    br $~lib/util/number/dtoa_impl|inlined.0
   end
   local.get $0
   call $~lib/util/number/dtoa_core
   i32.const 1
   i32.shl
   local.set $2
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.const 2
   call $~lib/rt/itcms/__new
   local.tee $1
   i32.store
   local.get $1
   i32.const 12496
   local.get $2
   memory.copy
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $1
 )
 (func $assembly/resonlang/EntangledNode#toString~anonymous|0 (param $0 f64) (param $1 i32) (param $2 i32) (result i32)
  local.get $0
  i32.const 2
  call $assembly/utils/toFixed
 )
 (func $~lib/util/number/itoa_buffered<u32> (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  i32.const 10
  i32.lt_u
  if
   local.get $0
   local.get $1
   i32.const 48
   i32.or
   i32.store16
   i32.const 1
   return
  end
  local.get $0
  local.get $1
  local.get $1
  i32.const 100000
  i32.lt_u
  if (result i32)
   local.get $1
   i32.const 100
   i32.lt_u
   if (result i32)
    local.get $1
    i32.const 10
    i32.ge_u
    i32.const 1
    i32.add
   else
    local.get $1
    i32.const 10000
    i32.ge_u
    i32.const 3
    i32.add
    local.get $1
    i32.const 1000
    i32.ge_u
    i32.add
   end
  else
   local.get $1
   i32.const 10000000
   i32.lt_u
   if (result i32)
    local.get $1
    i32.const 1000000
    i32.ge_u
    i32.const 6
    i32.add
   else
    local.get $1
    i32.const 1000000000
    i32.ge_u
    i32.const 8
    i32.add
    local.get $1
    i32.const 100000000
    i32.ge_u
    i32.add
   end
  end
  local.tee $0
  call $~lib/util/number/utoa32_dec_lut
  local.get $0
 )
 (func $assembly/resonlang/EntangledNode~visit (param $0 i32)
  (local $1 i32)
  local.get $0
  i32.load
  local.tee $1
  if
   local.get $1
   call $~lib/rt/itcms/__visit
  end
  local.get $0
  i32.load offset=4
  local.tee $1
  if
   local.get $1
   call $~lib/rt/itcms/__visit
  end
  local.get $0
  i32.load offset=8
  local.tee $0
  if
   local.get $0
   call $~lib/rt/itcms/__visit
  end
 )
 (func $~lib/array/Array<~lib/string/String>~visit (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load offset=4
  local.set $1
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $1
  local.get $0
  i32.load offset=12
  i32.const 2
  i32.shl
  i32.add
  local.set $2
  loop $while-continue|0
   local.get $1
   local.get $2
   i32.lt_u
   if
    local.get $1
    i32.load
    local.tee $3
    if
     local.get $3
     call $~lib/rt/itcms/__visit
    end
    local.get $1
    i32.const 4
    i32.add
    local.set $1
    br $while-continue|0
   end
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load
  call $~lib/rt/itcms/__visit
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/function/Function<%28f64%2Ci32%2C~lib/array/Array<f64>%29=>~lib/string/String>~visit (param $0 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load offset=4
  call $~lib/rt/itcms/__visit
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/rt/__visit_members (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  block $folding-inner1
   block $folding-inner0
    block $invalid
     block $assembly/resonlang/Attractor
      block $~lib/function/Function<%28assembly/resonlang/EntangledNode%2Ci32%2C~lib/array/Array<assembly/resonlang/EntangledNode>%29=>~lib/string/String>
       block $~lib/array/Array<assembly/resonlang/EntangledNode>
        block $~lib/function/Function<%28f64%2Ci32%2C~lib/array/Array<f64>%29=>~lib/string/String>
         block $~lib/array/Array<~lib/string/String>
          block $~lib/staticarray/StaticArray<~lib/string/String>
           block $~lib/staticarray/StaticArray<f64>
            block $"~lib/map/Map<u32,f64>"
             block $assembly/resonlang/ResonantFragment
              block $~lib/staticarray/StaticArray<u32>
               block $assembly/resonlang/EntangledNode
                block $~lib/arraybuffer/ArrayBufferView
                 block $~lib/string/String
                  block $~lib/arraybuffer/ArrayBuffer
                   block $~lib/object/Object
                    local.get $0
                    i32.const 8
                    i32.sub
                    i32.load
                    br_table $~lib/object/Object $~lib/arraybuffer/ArrayBuffer $~lib/string/String $~lib/arraybuffer/ArrayBufferView $assembly/resonlang/EntangledNode $~lib/staticarray/StaticArray<u32> $folding-inner0 $assembly/resonlang/ResonantFragment $"~lib/map/Map<u32,f64>" $~lib/staticarray/StaticArray<f64> $folding-inner0 $~lib/staticarray/StaticArray<~lib/string/String> $folding-inner0 $~lib/array/Array<~lib/string/String> $~lib/function/Function<%28f64%2Ci32%2C~lib/array/Array<f64>%29=>~lib/string/String> $~lib/array/Array<assembly/resonlang/EntangledNode> $~lib/function/Function<%28assembly/resonlang/EntangledNode%2Ci32%2C~lib/array/Array<assembly/resonlang/EntangledNode>%29=>~lib/string/String> $assembly/resonlang/Attractor $invalid
                   end
                   return
                  end
                  return
                 end
                 return
                end
                local.get $0
                i32.load
                local.tee $0
                if
                 local.get $0
                 call $~lib/rt/itcms/__visit
                end
                return
               end
               local.get $0
               call $assembly/resonlang/EntangledNode~visit
               return
              end
              return
             end
             local.get $0
             i32.load
             local.tee $1
             if
              local.get $1
              call $~lib/rt/itcms/__visit
             end
             local.get $0
             i32.load offset=4
             local.tee $0
             if
              local.get $0
              call $~lib/rt/itcms/__visit
             end
             return
            end
            global.get $~lib/memory/__stack_pointer
            i32.const 4
            i32.sub
            global.set $~lib/memory/__stack_pointer
            global.get $~lib/memory/__stack_pointer
            i32.const 24348
            i32.lt_s
            br_if $folding-inner1
            global.get $~lib/memory/__stack_pointer
            i32.const 0
            i32.store
            global.get $~lib/memory/__stack_pointer
            local.get $0
            i32.store
            local.get $0
            i32.load
            call $~lib/rt/itcms/__visit
            global.get $~lib/memory/__stack_pointer
            local.get $0
            i32.store
            local.get $0
            i32.load offset=8
            call $~lib/rt/itcms/__visit
            global.get $~lib/memory/__stack_pointer
            i32.const 4
            i32.add
            global.set $~lib/memory/__stack_pointer
            return
           end
           return
          end
          local.get $0
          local.get $0
          i32.const 20
          i32.sub
          i32.load offset=16
          i32.add
          local.set $1
          loop $while-continue|0
           local.get $0
           local.get $1
           i32.lt_u
           if
            local.get $0
            i32.load
            local.tee $2
            if
             local.get $2
             call $~lib/rt/itcms/__visit
            end
            local.get $0
            i32.const 4
            i32.add
            local.set $0
            br $while-continue|0
           end
          end
          return
         end
         local.get $0
         call $~lib/array/Array<~lib/string/String>~visit
         return
        end
        local.get $0
        call $~lib/function/Function<%28f64%2Ci32%2C~lib/array/Array<f64>%29=>~lib/string/String>~visit
        return
       end
       local.get $0
       call $~lib/array/Array<~lib/string/String>~visit
       return
      end
      local.get $0
      call $~lib/function/Function<%28f64%2Ci32%2C~lib/array/Array<f64>%29=>~lib/string/String>~visit
      return
     end
     local.get $0
     call $assembly/resonlang/EntangledNode~visit
     return
    end
    unreachable
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 24348
   i32.lt_s
   br_if $folding-inner1
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   i32.load
   call $~lib/rt/itcms/__visit
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   return
  end
  i32.const 57136
  i32.const 57184
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $~start
  memory.size
  i32.const 16
  i32.shl
  i32.const 57116
  i32.sub
  i32.const 1
  i32.shr_u
  global.set $~lib/rt/itcms/threshold
  i32.const 1380
  i32.const 1376
  i32.store
  i32.const 1384
  i32.const 1376
  i32.store
  i32.const 1376
  global.set $~lib/rt/itcms/pinSpace
  i32.const 1412
  i32.const 1408
  i32.store
  i32.const 1416
  i32.const 1408
  i32.store
  i32.const 1408
  global.set $~lib/rt/itcms/toSpace
  i32.const 1556
  i32.const 1552
  i32.store
  i32.const 1560
  i32.const 1552
  i32.store
  i32.const 1552
  global.set $~lib/rt/itcms/fromSpace
  call $assembly/index/runResoLangExample
 )
 (func $~lib/console/console.log (param $0 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  call $~lib/bindings/dom/console.log
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $"~lib/map/Map<u32,f64>#constructor" (result i32)
  (local $0 i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  i32.const 24
  i32.const 8
  call $~lib/rt/itcms/__new
  local.tee $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  i32.const 16
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $1
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=8
  local.get $0
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  i32.const 3
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  i32.const 96
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $1
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=8
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  i32.const 4
  i32.store offset=12
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  i32.const 0
  i32.store offset=16
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  i32.const 0
  i32.store offset=20
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $"~lib/map/Map<u32,f64>#find" (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load
  local.set $3
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $3
  local.get $2
  local.get $0
  i32.load offset=4
  i32.and
  i32.const 2
  i32.shl
  i32.add
  i32.load
  local.set $0
  loop $while-continue|0
   local.get $0
   if
    local.get $0
    i32.load offset=16
    local.tee $2
    i32.const 1
    i32.and
    if (result i32)
     i32.const 0
    else
     local.get $1
     local.get $0
     i32.load
     i32.eq
    end
    if
     global.get $~lib/memory/__stack_pointer
     i32.const 4
     i32.add
     global.set $~lib/memory/__stack_pointer
     local.get $0
     return
    end
    local.get $2
    i32.const -2
    i32.and
    local.set $0
    br $while-continue|0
   end
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  i32.const 0
 )
 (func $"~lib/map/Map<u32,f64>#set" (param $0 i32) (param $1 i32) (param $2 f64)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 24348
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   local.get $1
   local.get $1
   i32.const -1028477379
   i32.mul
   i32.const 374761397
   i32.add
   i32.const 17
   i32.rotl
   i32.const 668265263
   i32.mul
   local.tee $3
   i32.const 15
   i32.shr_u
   local.get $3
   i32.xor
   i32.const -2048144777
   i32.mul
   local.tee $3
   i32.const 13
   i32.shr_u
   local.get $3
   i32.xor
   i32.const -1028477379
   i32.mul
   local.tee $3
   i32.const 16
   i32.shr_u
   local.get $3
   i32.xor
   local.tee $7
   call $"~lib/map/Map<u32,f64>#find"
   local.tee $3
   if
    local.get $3
    local.get $2
    f64.store offset=8
   else
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    local.get $0
    i32.load offset=16
    local.set $3
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    local.get $3
    local.get $0
    i32.load offset=12
    i32.eq
    if
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $0
     i32.load offset=20
     local.set $3
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     local.get $3
     local.get $0
     i32.load offset=12
     i32.const 3
     i32.mul
     i32.const 4
     i32.div_s
     i32.lt_s
     if (result i32)
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store offset=4
      local.get $0
      i32.load offset=4
     else
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store offset=4
      local.get $0
      i32.load offset=4
      i32.const 1
      i32.shl
      i32.const 1
      i32.or
     end
     local.set $8
     global.get $~lib/memory/__stack_pointer
     i32.const 16
     i32.sub
     global.set $~lib/memory/__stack_pointer
     global.get $~lib/memory/__stack_pointer
     i32.const 24348
     i32.lt_s
     br_if $folding-inner0
     global.get $~lib/memory/__stack_pointer
     i64.const 0
     i64.store
     global.get $~lib/memory/__stack_pointer
     i64.const 0
     i64.store offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $8
     i32.const 1
     i32.add
     local.tee $3
     i32.const 2
     i32.shl
     call $~lib/arraybuffer/ArrayBuffer#constructor
     local.tee $9
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.const 3
     i32.shl
     i32.const 3
     i32.div_s
     local.tee $6
     i32.const 24
     i32.mul
     call $~lib/arraybuffer/ArrayBuffer#constructor
     local.tee $4
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=8
     local.get $0
     i32.load offset=8
     local.set $10
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=8
     local.get $10
     local.get $0
     i32.load offset=16
     i32.const 24
     i32.mul
     i32.add
     local.set $5
     local.get $4
     local.set $3
     loop $while-continue|0
      local.get $5
      local.get $10
      i32.ne
      if
       local.get $10
       i32.load offset=16
       i32.const 1
       i32.and
       i32.eqz
       if
        local.get $3
        local.get $10
        i32.load
        local.tee $11
        i32.store
        local.get $3
        local.get $10
        f64.load offset=8
        f64.store offset=8
        local.get $3
        local.get $9
        local.get $8
        local.get $11
        i32.const -1028477379
        i32.mul
        i32.const 374761397
        i32.add
        i32.const 17
        i32.rotl
        i32.const 668265263
        i32.mul
        local.tee $11
        i32.const 15
        i32.shr_u
        local.get $11
        i32.xor
        i32.const -2048144777
        i32.mul
        local.tee $11
        i32.const 13
        i32.shr_u
        local.get $11
        i32.xor
        i32.const -1028477379
        i32.mul
        local.tee $11
        i32.const 16
        i32.shr_u
        local.get $11
        i32.xor
        i32.and
        i32.const 2
        i32.shl
        i32.add
        local.tee $11
        i32.load
        i32.store offset=16
        local.get $11
        local.get $3
        i32.store
        local.get $3
        i32.const 24
        i32.add
        local.set $3
       end
       local.get $10
       i32.const 24
       i32.add
       local.set $10
       br $while-continue|0
      end
     end
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $9
     i32.store offset=12
     local.get $0
     local.get $9
     i32.store
     local.get $0
     local.get $9
     i32.const 0
     call $~lib/rt/itcms/__link
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=8
     local.get $0
     local.get $8
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $4
     i32.store offset=12
     local.get $0
     local.get $4
     i32.store offset=8
     local.get $0
     local.get $4
     i32.const 0
     call $~lib/rt/itcms/__link
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=8
     local.get $0
     local.get $6
     i32.store offset=12
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=12
     local.get $0
     local.get $0
     i32.load offset=20
     i32.store offset=16
     global.get $~lib/memory/__stack_pointer
     i32.const 16
     i32.add
     global.set $~lib/memory/__stack_pointer
    end
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.load offset=8
    local.tee $3
    i32.store offset=8
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    local.get $0
    local.get $0
    i32.load offset=16
    local.tee $4
    i32.const 1
    i32.add
    i32.store offset=16
    local.get $3
    local.get $4
    i32.const 24
    i32.mul
    i32.add
    local.tee $3
    local.get $1
    i32.store
    local.get $3
    local.get $2
    f64.store offset=8
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    local.get $0
    local.get $0
    i32.load offset=20
    i32.const 1
    i32.add
    i32.store offset=20
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    local.get $0
    i32.load
    local.set $1
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    local.get $3
    local.get $1
    local.get $7
    local.get $0
    i32.load offset=4
    i32.and
    i32.const 2
    i32.shl
    i32.add
    local.tee $0
    i32.load
    i32.store offset=16
    local.get $0
    local.get $3
    i32.store
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   return
  end
  i32.const 57136
  i32.const 57184
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $~lib/array/ensureCapacity (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  (local $4 i32)
  (local $5 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $1
  local.get $0
  i32.load offset=8
  local.tee $5
  local.get $2
  i32.shr_u
  i32.gt_u
  if
   local.get $1
   i32.const 1073741820
   local.get $2
   i32.shr_u
   i32.gt_u
   if
    i32.const 1664
    i32.const 5888
    i32.const 19
    i32.const 48
    call $~lib/builtins/abort
    unreachable
   end
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   i32.load
   local.set $4
   i32.const 8
   local.get $1
   local.get $1
   i32.const 8
   i32.le_u
   select
   local.get $2
   i32.shl
   local.set $1
   local.get $3
   if
    i32.const 1073741820
    local.get $5
    i32.const 1
    i32.shl
    local.tee $2
    local.get $2
    i32.const 1073741820
    i32.ge_u
    select
    local.tee $2
    local.get $1
    local.get $1
    local.get $2
    i32.lt_u
    select
    local.set $1
   end
   block $__inlined_func$~lib/rt/itcms/__renew$454
    local.get $4
    i32.const 20
    i32.sub
    local.tee $3
    i32.load
    i32.const -4
    i32.and
    i32.const 16
    i32.sub
    local.get $1
    i32.ge_u
    if
     local.get $3
     local.get $1
     i32.store offset=16
     local.get $4
     local.set $2
     br $__inlined_func$~lib/rt/itcms/__renew$454
    end
    local.get $1
    local.get $3
    i32.load offset=12
    call $~lib/rt/itcms/__new
    local.tee $2
    local.get $4
    local.get $1
    local.get $3
    i32.load offset=16
    local.tee $3
    local.get $1
    local.get $3
    i32.lt_u
    select
    memory.copy
   end
   local.get $2
   local.get $4
   i32.ne
   if
    local.get $0
    local.get $2
    i32.store
    local.get $0
    local.get $2
    i32.store offset=4
    local.get $0
    local.get $2
    i32.const 0
    call $~lib/rt/itcms/__link
   end
   local.get $0
   local.get $1
   i32.store offset=8
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/array/Array<f64>#__set (param $0 i32) (param $1 i32) (param $2 f64)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $1
  local.get $0
  i32.load offset=12
  i32.ge_u
  if
   local.get $1
   i32.const 0
   i32.lt_s
   if
    i32.const 1456
    i32.const 5888
    i32.const 130
    i32.const 22
    call $~lib/builtins/abort
    unreachable
   end
   local.get $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $3
   i32.const 3
   i32.const 1
   call $~lib/array/ensureCapacity
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   local.get $3
   i32.store offset=12
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load offset=4
  local.get $1
  i32.const 3
  i32.shl
  i32.add
  local.get $2
  f64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/array/Array<f64>#get:length (param $0 i32) (result i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load offset=12
  local.set $0
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $assembly/resonlang/ResonantFragment#constructor (param $0 i32) (param $1 f64) (param $2 f64) (param $3 f64) (result i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 24
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 24348
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.const 24
   memory.fill
   global.get $~lib/memory/__stack_pointer
   i32.const 16
   i32.const 7
   call $~lib/rt/itcms/__new
   local.tee $4
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store offset=4
   local.get $4
   i32.const 0
   i32.store
   local.get $4
   i32.const 0
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store offset=4
   local.get $4
   i32.const 0
   i32.store offset=4
   local.get $4
   i32.const 0
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store offset=4
   local.get $4
   f64.const 0
   f64.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=8
   local.get $4
   local.get $0
   i32.store
   local.get $4
   local.get $0
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   i32.const 2
   i32.const 3
   i32.const 6
   call $~lib/rt/__newArray
   local.tee $5
   i32.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $5
   i32.load offset=4
   i32.store offset=20
   local.get $5
   i32.const 0
   local.get $1
   call $~lib/array/Array<f64>#__set
   local.get $5
   i32.const 1
   local.get $2
   call $~lib/array/Array<f64>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $5
   i32.store offset=12
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 24348
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store
   global.get $~lib/memory/__stack_pointer
   local.get $5
   i32.store
   local.get $5
   call $~lib/array/Array<f64>#get:length
   i32.const 3
   i32.shl
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.const 9
   call $~lib/rt/itcms/__new
   local.tee $6
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $5
   i32.store
   local.get $6
   local.get $5
   i32.load offset=4
   local.get $0
   memory.copy
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store offset=8
   local.get $4
   local.get $6
   i32.store offset=4
   local.get $4
   local.get $6
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store offset=4
   local.get $4
   local.get $3
   f64.store offset=8
   global.get $~lib/memory/__stack_pointer
   i32.const 24
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $4
   return
  end
  i32.const 57136
  i32.const 57184
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $assembly/resonlang/ResonantFragment.encode (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 f64)
  (local $4 i32)
  (local $5 i32)
  (local $6 f64)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 f64)
  (local $11 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 24348
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store
   global.get $~lib/memory/__stack_pointer
   call $"~lib/map/Map<u32,f64>#constructor"
   local.tee $7
   i32.store
   i32.const 2
   local.set $2
   loop $for-loop|0
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    local.get $8
    local.get $0
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 1
    i32.shr_u
    i32.lt_s
    if
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     i32.const 4
     i32.sub
     global.set $~lib/memory/__stack_pointer
     global.get $~lib/memory/__stack_pointer
     i32.const 24348
     i32.lt_s
     br_if $folding-inner0
     global.get $~lib/memory/__stack_pointer
     i32.const 0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     block $__inlined_func$~lib/string/String#charCodeAt$489
      local.get $8
      local.get $0
      i32.const 20
      i32.sub
      i32.load offset=16
      i32.const 1
      i32.shr_u
      i32.ge_u
      if
       global.get $~lib/memory/__stack_pointer
       i32.const 4
       i32.add
       global.set $~lib/memory/__stack_pointer
       i32.const -1
       local.set $9
       br $__inlined_func$~lib/string/String#charCodeAt$489
      end
      local.get $0
      local.get $8
      i32.const 1
      i32.shl
      i32.add
      i32.load16_u
      local.set $9
      global.get $~lib/memory/__stack_pointer
      i32.const 4
      i32.add
      global.set $~lib/memory/__stack_pointer
     end
     local.get $2
     local.set $1
     loop $while-continue|1
      i32.const 0
      local.set $5
      block $__inlined_func$assembly/resonlang/isPrime$167
       local.get $1
       i32.const 1
       i32.le_u
       br_if $__inlined_func$assembly/resonlang/isPrime$167
       i32.const 1
       local.set $5
       local.get $1
       i32.const 3
       i32.le_u
       br_if $__inlined_func$assembly/resonlang/isPrime$167
       i32.const 0
       local.set $5
       local.get $1
       i32.const 1
       i32.and
       if (result i32)
        local.get $1
        i32.const 3
        i32.rem_u
       else
        i32.const 0
       end
       i32.eqz
       br_if $__inlined_func$assembly/resonlang/isPrime$167
       i32.const 5
       local.set $4
       loop $for-loop|00
        local.get $4
        local.get $4
        i32.mul
        local.get $1
        i32.le_u
        if
         local.get $1
         local.get $4
         i32.rem_u
         if (result i32)
          local.get $1
          local.get $4
          i32.const 2
          i32.add
          i32.rem_u
         else
          i32.const 0
         end
         i32.eqz
         br_if $__inlined_func$assembly/resonlang/isPrime$167
         local.get $4
         i32.const 6
         i32.add
         local.set $4
         br $for-loop|00
        end
       end
       i32.const 1
       local.set $5
      end
      local.get $5
      i32.eqz
      local.get $1
      i32.const 100000
      i32.lt_u
      i32.and
      if
       local.get $1
       i32.const 1
       i32.add
       local.set $1
       br $while-continue|1
      end
     end
     global.get $~lib/memory/__stack_pointer
     local.get $7
     i32.store offset=4
     local.get $7
     local.get $2
     local.get $1
     local.get $1
     i32.const 100000
     i32.ge_u
     select
     local.tee $1
     local.get $9
     f64.convert_i32_s
     f64.const 255
     f64.div
     local.tee $3
     call $"~lib/map/Map<u32,f64>#set"
     local.get $6
     f64.const 1
     local.get $3
     f64.const 2.220446049250313e-16
     f64.add
     f64.div
     call $~lib/math/NativeMath.log
     local.get $3
     f64.mul
     f64.add
     local.set $6
     local.get $1
     i32.const 1
     i32.add
     local.set $2
     local.get $8
     i32.const 1
     i32.add
     local.set $8
     br $for-loop|0
    end
   end
   local.get $6
   f64.const 100
   call $~lib/math/NativeMath.mod
   local.set $10
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 20
   i32.sub
   i32.load offset=16
   i32.const 1
   i32.shr_u
   f64.convert_i32_s
   f64.const 0.1
   f64.mul
   local.set $11
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   i32.const 20
   i32.sub
   i32.load offset=16
   i32.const 1
   i32.shr_u
   if (result f64)
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    local.get $6
    local.get $0
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 1
    i32.shr_u
    f64.convert_i32_s
    f64.div
   else
    f64.const 0
   end
   local.set $3
   global.get $~lib/memory/__stack_pointer
   local.get $7
   i32.store offset=4
   local.get $7
   local.get $10
   local.get $11
   local.get $3
   call $assembly/resonlang/ResonantFragment#constructor
   local.set $0
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $0
   return
  end
  i32.const 57136
  i32.const 57184
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $~lib/string/String#concat (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const -2
  i32.and
  local.set $2
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store
  local.get $1
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const -2
  i32.and
  local.tee $3
  local.get $2
  i32.add
  local.tee $4
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const 13920
   return
  end
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.const 2
  call $~lib/rt/itcms/__new
  local.tee $4
  i32.store offset=4
  local.get $4
  local.get $0
  local.get $2
  memory.copy
  local.get $2
  local.get $4
  i32.add
  local.get $1
  local.get $3
  memory.copy
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $4
 )
 (func $~lib/string/String.__concat (param $0 i32) (param $1 i32) (result i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=4
  local.get $0
  local.get $1
  call $~lib/string/String#concat
  local.set $0
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $assembly/utils/toFixed (param $0 f64) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 f64)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 24348
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.store offset=8
   f64.const 10
   local.get $1
   f64.convert_i32_s
   call $~lib/math/NativeMath.pow
   local.set $9
   global.get $~lib/memory/__stack_pointer
   local.get $0
   local.get $9
   f64.mul
   local.tee $0
   f64.ceil
   local.tee $13
   local.get $13
   f64.const -1
   f64.add
   local.get $13
   f64.const -0.5
   f64.add
   local.get $0
   f64.le
   select
   local.get $9
   f64.div
   call $~lib/number/F64#toString
   local.tee $5
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $5
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   i32.const 13888
   i32.store offset=8
   block $__inlined_func$~lib/string/String#indexOf$2 (result i32)
    global.get $~lib/memory/__stack_pointer
    i32.const 8
    i32.sub
    global.set $~lib/memory/__stack_pointer
    global.get $~lib/memory/__stack_pointer
    i32.const 24348
    i32.lt_s
    br_if $folding-inner0
    global.get $~lib/memory/__stack_pointer
    i64.const 0
    i64.store
    global.get $~lib/memory/__stack_pointer
    i32.const 13888
    i32.store
    i32.const 13884
    i32.load
    i32.const 1
    i32.shr_u
    local.tee $3
    i32.eqz
    if
     global.get $~lib/memory/__stack_pointer
     i32.const 8
     i32.add
     global.set $~lib/memory/__stack_pointer
     i32.const 0
     br $__inlined_func$~lib/string/String#indexOf$2
    end
    global.get $~lib/memory/__stack_pointer
    local.get $5
    i32.store
    local.get $5
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 1
    i32.shr_u
    local.tee $2
    i32.eqz
    if
     global.get $~lib/memory/__stack_pointer
     i32.const 8
     i32.add
     global.set $~lib/memory/__stack_pointer
     i32.const -1
     br $__inlined_func$~lib/string/String#indexOf$2
    end
    local.get $2
    local.get $3
    i32.sub
    local.set $10
    loop $for-loop|0
     local.get $8
     local.get $10
     i32.le_s
     if
      global.get $~lib/memory/__stack_pointer
      local.get $5
      i32.store
      global.get $~lib/memory/__stack_pointer
      i32.const 13888
      i32.store offset=4
      i32.const 13888
      local.set $6
      i32.const 1
      local.get $5
      local.get $8
      i32.const 1
      i32.shl
      i32.add
      local.tee $7
      i32.const 7
      i32.and
      local.get $3
      local.tee $2
      i32.const 4
      i32.lt_u
      select
      i32.eqz
      if
       loop $do-loop|0
        local.get $7
        i64.load
        local.get $6
        i64.load
        i64.eq
        if
         local.get $7
         i32.const 8
         i32.add
         local.set $7
         local.get $6
         i32.const 8
         i32.add
         local.set $6
         local.get $2
         i32.const 4
         i32.sub
         local.tee $2
         i32.const 4
         i32.ge_u
         br_if $do-loop|0
        end
       end
      end
      block $__inlined_func$~lib/util/string/compareImpl$169
       loop $while-continue|1
        local.get $2
        local.tee $4
        i32.const 1
        i32.sub
        local.set $2
        local.get $4
        if
         local.get $7
         i32.load16_u
         local.tee $11
         local.get $6
         i32.load16_u
         local.tee $12
         i32.sub
         local.set $4
         local.get $11
         local.get $12
         i32.ne
         br_if $__inlined_func$~lib/util/string/compareImpl$169
         local.get $7
         i32.const 2
         i32.add
         local.set $7
         local.get $6
         i32.const 2
         i32.add
         local.set $6
         br $while-continue|1
        end
       end
       i32.const 0
       local.set $4
      end
      local.get $4
      i32.eqz
      if
       global.get $~lib/memory/__stack_pointer
       i32.const 8
       i32.add
       global.set $~lib/memory/__stack_pointer
       local.get $8
       br $__inlined_func$~lib/string/String#indexOf$2
      end
      local.get $8
      i32.const 1
      i32.add
      local.set $8
      br $for-loop|0
     end
    end
    global.get $~lib/memory/__stack_pointer
    i32.const 8
    i32.add
    global.set $~lib/memory/__stack_pointer
    i32.const -1
   end
   local.tee $2
   i32.const -1
   i32.eq
   if
    global.get $~lib/memory/__stack_pointer
    local.get $5
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    i32.const 13888
    i32.store offset=8
    global.get $~lib/memory/__stack_pointer
    local.get $5
    i32.const 13888
    call $~lib/string/String.__concat
    local.tee $5
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $5
    i32.store offset=4
    local.get $5
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 1
    i32.shr_u
    i32.const 1
    i32.sub
    local.set $2
   end
   global.get $~lib/memory/__stack_pointer
   local.get $5
   i32.store offset=4
   local.get $5
   i32.const 20
   i32.sub
   i32.load offset=16
   i32.const 1
   i32.shr_u
   local.get $2
   i32.sub
   i32.const 1
   i32.sub
   local.set $2
   loop $for-loop|00
    local.get $1
    local.get $2
    i32.gt_s
    if
     global.get $~lib/memory/__stack_pointer
     local.get $5
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     i32.const 13952
     i32.store offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $5
     i32.const 13952
     call $~lib/string/String.__concat
     local.tee $5
     i32.store
     local.get $2
     i32.const 1
     i32.add
     local.set $2
     br $for-loop|00
    end
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $5
   return
  end
  i32.const 57136
  i32.const 57184
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $~lib/staticarray/StaticArray<f64>#__get (param $0 i32) (param $1 i32) (result f64)
  (local $2 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $1
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const 3
  i32.shr_u
  i32.ge_u
  if
   i32.const 1456
   i32.const 13984
   i32.const 78
   i32.const 41
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $1
  i32.const 3
  i32.shl
  i32.add
  f64.load
  local.set $2
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $2
 )
 (func $~lib/util/string/joinStringArray (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 16
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store offset=8
  local.get $1
  i32.const 1
  i32.sub
  local.tee $5
  i32.const 0
  i32.lt_s
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 16
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const 13920
   return
  end
  local.get $5
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load
   local.tee $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 16
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $0
   i32.const 13920
   local.get $0
   select
   return
  end
  loop $for-loop|0
   local.get $1
   local.get $4
   i32.gt_s
   if
    global.get $~lib/memory/__stack_pointer
    local.get $0
    local.get $4
    i32.const 2
    i32.shl
    i32.add
    i32.load
    local.tee $6
    i32.store offset=4
    local.get $6
    if
     global.get $~lib/memory/__stack_pointer
     local.get $6
     i32.store offset=8
     local.get $3
     local.get $6
     i32.const 20
     i32.sub
     i32.load offset=16
     i32.const 1
     i32.shr_u
     i32.add
     local.set $3
    end
    local.get $4
    i32.const 1
    i32.add
    local.set $4
    br $for-loop|0
   end
  end
  i32.const 0
  local.set $4
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $3
  local.get $2
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const 1
  i32.shr_u
  local.tee $1
  local.get $5
  i32.mul
  i32.add
  i32.const 1
  i32.shl
  i32.const 2
  call $~lib/rt/itcms/__new
  local.tee $6
  i32.store offset=12
  i32.const 0
  local.set $3
  loop $for-loop|1
   local.get $3
   local.get $5
   i32.lt_s
   if
    global.get $~lib/memory/__stack_pointer
    local.get $0
    local.get $3
    i32.const 2
    i32.shl
    i32.add
    i32.load
    local.tee $7
    i32.store offset=4
    local.get $7
    if
     global.get $~lib/memory/__stack_pointer
     local.get $7
     i32.store offset=8
     local.get $6
     local.get $4
     i32.const 1
     i32.shl
     i32.add
     local.get $7
     local.get $7
     i32.const 20
     i32.sub
     i32.load offset=16
     i32.const 1
     i32.shr_u
     local.tee $7
     i32.const 1
     i32.shl
     memory.copy
     local.get $4
     local.get $7
     i32.add
     local.set $4
    end
    local.get $1
    if
     local.get $6
     local.get $4
     i32.const 1
     i32.shl
     i32.add
     local.get $2
     local.get $1
     i32.const 1
     i32.shl
     memory.copy
     local.get $1
     local.get $4
     i32.add
     local.set $4
    end
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    br $for-loop|1
   end
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  local.get $5
  i32.const 2
  i32.shl
  i32.add
  i32.load
  local.tee $0
  i32.store offset=4
  local.get $0
  if
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=8
   local.get $6
   local.get $4
   i32.const 1
   i32.shl
   i32.add
   local.get $0
   local.get $0
   i32.const 20
   i32.sub
   i32.load offset=16
   i32.const -2
   i32.and
   memory.copy
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 16
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $6
 )
 (func $~lib/staticarray/StaticArray<~lib/string/String>#join (param $0 i32) (result i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const 2
  i32.shr_u
  local.set $1
  global.get $~lib/memory/__stack_pointer
  i32.const 13920
  i32.store
  local.get $0
  local.get $1
  i32.const 13920
  call $~lib/util/string/joinStringArray
  local.set $0
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $~lib/array/Array<u32>#constructor (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 16
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store offset=8
  global.get $~lib/memory/__stack_pointer
  i32.const 16
  i32.const 12
  call $~lib/rt/itcms/__new
  local.tee $1
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=4
  local.get $1
  i32.const 0
  i32.store
  local.get $1
  i32.const 0
  i32.const 0
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=4
  local.get $1
  i32.const 0
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=4
  local.get $1
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=4
  local.get $1
  i32.const 0
  i32.store offset=12
  local.get $0
  i32.const 268435455
  i32.gt_u
  if
   i32.const 1664
   i32.const 5888
   i32.const 70
   i32.const 60
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  local.get $0
  local.get $0
  i32.const 8
  i32.le_u
  select
  i32.const 2
  i32.shl
  local.tee $3
  i32.const 1
  call $~lib/rt/itcms/__new
  local.tee $2
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=12
  local.get $1
  local.get $2
  i32.store
  local.get $1
  local.get $2
  i32.const 0
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=4
  local.get $1
  local.get $2
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=4
  local.get $1
  local.get $3
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=4
  local.get $1
  local.get $0
  i32.store offset=12
  global.get $~lib/memory/__stack_pointer
  i32.const 16
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $1
 )
 (func $~lib/array/Array<u32>#__set (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $1
  local.get $0
  i32.load offset=12
  i32.ge_u
  if
   local.get $1
   i32.const 0
   i32.lt_s
   if
    i32.const 1456
    i32.const 5888
    i32.const 130
    i32.const 22
    call $~lib/builtins/abort
    unreachable
   end
   local.get $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $3
   i32.const 2
   i32.const 1
   call $~lib/array/ensureCapacity
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   local.get $3
   i32.store offset=12
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load offset=4
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  local.get $2
  i32.store
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $"~lib/map/Map<u32,f64>#keys" (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 24348
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   i32.load offset=8
   local.set $3
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load offset=16
   local.tee $5
   call $~lib/array/Array<u32>#constructor
   local.tee $4
   i32.store offset=4
   loop $for-loop|0
    local.get $2
    local.get $5
    i32.lt_s
    if
     local.get $3
     local.get $2
     i32.const 24
     i32.mul
     i32.add
     local.tee $0
     i32.load offset=16
     i32.const 1
     i32.and
     i32.eqz
     if
      global.get $~lib/memory/__stack_pointer
      local.get $4
      i32.store
      local.get $4
      local.get $1
      local.get $0
      i32.load
      call $~lib/array/Array<u32>#__set
      local.get $1
      i32.const 1
      i32.add
      local.set $1
     end
     local.get $2
     i32.const 1
     i32.add
     local.set $2
     br $for-loop|0
    end
   end
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 24348
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.store
   local.get $4
   local.get $1
   i32.const 2
   i32.const 0
   call $~lib/array/ensureCapacity
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store
   local.get $4
   local.get $1
   i32.store offset=12
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $4
   return
  end
  i32.const 57136
  i32.const 57184
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $~lib/array/Array<u32>#__get (param $0 i32) (param $1 i32) (result i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $1
  local.get $0
  i32.load offset=12
  i32.ge_u
  if
   i32.const 1456
   i32.const 5888
   i32.const 114
   i32.const 42
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load offset=4
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  i32.load
  local.set $0
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $"~lib/map/Map<u32,f64>#get" (param $0 i32) (param $1 i32) (result f64)
  (local $2 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  local.get $1
  local.get $1
  i32.const -1028477379
  i32.mul
  i32.const 374761397
  i32.add
  i32.const 17
  i32.rotl
  i32.const 668265263
  i32.mul
  local.tee $0
  local.get $0
  i32.const 15
  i32.shr_u
  i32.xor
  i32.const -2048144777
  i32.mul
  local.tee $0
  local.get $0
  i32.const 13
  i32.shr_u
  i32.xor
  i32.const -1028477379
  i32.mul
  local.tee $0
  local.get $0
  i32.const 16
  i32.shr_u
  i32.xor
  call $"~lib/map/Map<u32,f64>#find"
  local.tee $0
  i32.eqz
  if
   i32.const 15472
   i32.const 15536
   i32.const 105
   i32.const 17
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  f64.load offset=8
  local.set $2
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $2
 )
 (func $assembly/resonlang/ResonantFragment#toString (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 44
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 24348
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.const 44
   memory.fill
   global.get $~lib/memory/__stack_pointer
   local.set $1
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   f64.load offset=8
   i32.const 4
   call $assembly/utils/toFixed
   local.tee $3
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load offset=4
   local.tee $4
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.const 0
   call $~lib/staticarray/StaticArray<f64>#__get
   i32.const 2
   call $assembly/utils/toFixed
   local.tee $4
   i32.store offset=12
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load offset=4
   local.tee $5
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $5
   i32.const 1
   call $~lib/staticarray/StaticArray<f64>#__get
   i32.const 2
   call $assembly/utils/toFixed
   local.tee $5
   i32.store offset=16
   global.get $~lib/memory/__stack_pointer
   i32.const 6144
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store offset=8
   i32.const 6148
   local.get $3
   i32.store
   i32.const 6144
   local.get $3
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 6144
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store offset=8
   i32.const 6156
   local.get $4
   i32.store
   i32.const 6144
   local.get $4
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 6144
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $5
   i32.store offset=8
   i32.const 6164
   local.get $5
   i32.store
   i32.const 6144
   local.get $5
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 6144
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 13920
   i32.store offset=8
   local.get $1
   i32.const 6144
   call $~lib/staticarray/StaticArray<~lib/string/String>#join
   local.tee $1
   i32.store offset=20
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load
   local.tee $3
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $3
   call $"~lib/map/Map<u32,f64>#keys"
   local.tee $5
   i32.store offset=24
   loop $for-loop|0
    global.get $~lib/memory/__stack_pointer
    local.get $5
    i32.store
    local.get $5
    call $~lib/array/Array<f64>#get:length
    local.get $2
    i32.gt_s
    if
     global.get $~lib/memory/__stack_pointer
     local.get $5
     i32.store
     local.get $5
     local.get $2
     call $~lib/array/Array<u32>#__get
     local.set $3
     global.get $~lib/memory/__stack_pointer
     local.get $1
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.set $6
     global.get $~lib/memory/__stack_pointer
     local.get $3
     call $~lib/util/number/utoa32
     local.tee $4
     i32.store offset=28
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=36
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load
     local.tee $7
     i32.store offset=32
     global.get $~lib/memory/__stack_pointer
     local.get $7
     local.get $3
     call $"~lib/map/Map<u32,f64>#get"
     i32.const 4
     call $assembly/utils/toFixed
     local.tee $3
     i32.store offset=40
     global.get $~lib/memory/__stack_pointer
     i32.const 14080
     i32.store offset=32
     global.get $~lib/memory/__stack_pointer
     local.get $4
     i32.store offset=36
     i32.const 14080
     local.get $4
     i32.store
     i32.const 14080
     local.get $4
     i32.const 1
     call $~lib/rt/itcms/__link
     global.get $~lib/memory/__stack_pointer
     i32.const 14080
     i32.store offset=32
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store offset=36
     i32.const 14088
     local.get $3
     i32.store
     i32.const 14080
     local.get $3
     i32.const 1
     call $~lib/rt/itcms/__link
     global.get $~lib/memory/__stack_pointer
     i32.const 14080
     i32.store offset=32
     global.get $~lib/memory/__stack_pointer
     i32.const 13920
     i32.store offset=36
     i32.const 14080
     call $~lib/staticarray/StaticArray<~lib/string/String>#join
     local.set $3
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store offset=8
     local.get $6
     local.get $1
     local.get $3
     call $~lib/string/String.__concat
     local.tee $1
     i32.store offset=20
     local.get $2
     i32.const 1
     i32.add
     local.set $2
     br $for-loop|0
    end
   end
   global.get $~lib/memory/__stack_pointer
   local.get $5
   i32.store
   local.get $5
   call $~lib/array/Array<f64>#get:length
   i32.const 0
   i32.gt_s
   if
    global.get $~lib/memory/__stack_pointer
    local.set $2
    global.get $~lib/memory/__stack_pointer
    local.get $1
    i32.store
    global.get $~lib/memory/__stack_pointer
    i32.const 8
    i32.sub
    global.set $~lib/memory/__stack_pointer
    global.get $~lib/memory/__stack_pointer
    i32.const 24348
    i32.lt_s
    br_if $folding-inner0
    global.get $~lib/memory/__stack_pointer
    i64.const 0
    i64.store
    global.get $~lib/memory/__stack_pointer
    local.get $1
    local.tee $0
    i32.store
    block $__inlined_func$~lib/string/String#slice$490
     local.get $1
     i32.const 20
     i32.sub
     i32.load offset=16
     i32.const 1
     i32.shr_u
     i32.const 2
     i32.sub
     local.tee $1
     i32.const 0
     local.get $1
     i32.const 0
     i32.gt_s
     select
     local.tee $1
     i32.const 0
     i32.le_s
     if
      global.get $~lib/memory/__stack_pointer
      i32.const 8
      i32.add
      global.set $~lib/memory/__stack_pointer
      i32.const 13920
      local.set $1
      br $__inlined_func$~lib/string/String#slice$490
     end
     global.get $~lib/memory/__stack_pointer
     local.get $1
     i32.const 1
     i32.shl
     local.tee $3
     i32.const 2
     call $~lib/rt/itcms/__new
     local.tee $1
     i32.store offset=4
     local.get $1
     local.get $0
     local.get $3
     memory.copy
     global.get $~lib/memory/__stack_pointer
     i32.const 8
     i32.add
     global.set $~lib/memory/__stack_pointer
    end
    local.get $2
    local.get $1
    i32.store offset=20
   end
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 15584
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.const 15584
   call $~lib/string/String.__concat
   local.tee $0
   i32.store offset=20
   global.get $~lib/memory/__stack_pointer
   i32.const 44
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $0
   return
  end
  i32.const 57136
  i32.const 57184
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $~lib/array/Array<f64>#constructor (result i32)
  (local $0 i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 16
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store offset=8
  global.get $~lib/memory/__stack_pointer
  i32.const 16
  i32.const 6
  call $~lib/rt/itcms/__new
  local.tee $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  i32.const 0
  i32.store
  local.get $0
  i32.const 0
  i32.const 0
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  i32.const 0
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  i32.const 0
  i32.store offset=12
  global.get $~lib/memory/__stack_pointer
  i32.const 64
  i32.const 1
  call $~lib/rt/itcms/__new
  local.tee $1
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=12
  local.get $0
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.const 0
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  local.get $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  i32.const 64
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  local.get $0
  i32.const 0
  i32.store offset=12
  global.get $~lib/memory/__stack_pointer
  i32.const 16
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $~lib/array/Array<f64>#push (param $0 i32) (param $1 f64)
  (local $2 i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  local.get $0
  i32.load offset=12
  local.tee $2
  i32.const 1
  i32.add
  local.tee $3
  i32.const 3
  i32.const 1
  call $~lib/array/ensureCapacity
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load offset=4
  local.get $2
  i32.const 3
  i32.shl
  i32.add
  local.get $1
  f64.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  local.get $3
  i32.store offset=12
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/resonlang/EntangledNode.generateNode (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 f64)
  (local $4 f64)
  (local $5 f64)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 28
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner1
   global.get $~lib/memory/__stack_pointer
   i32.const 24348
   i32.lt_s
   br_if $folding-inner1
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.const 28
   memory.fill
   global.get $~lib/memory/__stack_pointer
   local.set $6
   global.get $~lib/memory/__stack_pointer
   local.get $0
   call $~lib/util/number/utoa32
   local.tee $7
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $1
   call $~lib/util/number/utoa32
   local.tee $8
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $2
   call $~lib/util/number/utoa32
   local.tee $9
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   i32.const 15744
   i32.store offset=12
   global.get $~lib/memory/__stack_pointer
   local.get $7
   i32.store offset=16
   i32.const 15748
   local.get $7
   i32.store
   i32.const 15744
   local.get $7
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 15744
   i32.store offset=12
   global.get $~lib/memory/__stack_pointer
   local.get $8
   i32.store offset=16
   i32.const 15756
   local.get $8
   i32.store
   i32.const 15744
   local.get $8
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 15744
   i32.store offset=12
   global.get $~lib/memory/__stack_pointer
   local.get $9
   i32.store offset=16
   i32.const 15764
   local.get $9
   i32.store
   i32.const 15744
   local.get $9
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 15744
   i32.store offset=12
   global.get $~lib/memory/__stack_pointer
   i32.const 13920
   i32.store offset=16
   local.get $6
   i32.const 15744
   call $~lib/staticarray/StaticArray<~lib/string/String>#join
   local.tee $6
   i32.store offset=20
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store offset=12
   global.get $~lib/memory/__stack_pointer
   block $__inlined_func$assembly/resonlang/EntangledNode#constructor$11 (result i32)
    global.get $~lib/memory/__stack_pointer
    i32.const 24
    i32.sub
    global.set $~lib/memory/__stack_pointer
    block $folding-inner0
     global.get $~lib/memory/__stack_pointer
     i32.const 24348
     i32.lt_s
     br_if $folding-inner0
     global.get $~lib/memory/__stack_pointer
     i32.const 0
     i32.const 24
     memory.fill
     global.get $~lib/memory/__stack_pointer
     i32.const 24
     i32.const 4
     call $~lib/rt/itcms/__new
     local.tee $7
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $7
     i32.store offset=4
     local.get $7
     i32.const 0
     i32.store
     local.get $7
     i32.const 0
     i32.const 0
     call $~lib/rt/itcms/__link
     global.get $~lib/memory/__stack_pointer
     local.get $7
     i32.store offset=4
     local.get $7
     i32.const 0
     i32.store offset=4
     local.get $7
     i32.const 0
     i32.const 0
     call $~lib/rt/itcms/__link
     global.get $~lib/memory/__stack_pointer
     local.get $7
     i32.store offset=4
     local.get $7
     i32.const 0
     i32.store offset=8
     local.get $7
     i32.const 0
     i32.const 0
     call $~lib/rt/itcms/__link
     global.get $~lib/memory/__stack_pointer
     local.get $7
     i32.store offset=4
     local.get $7
     f64.const 0
     f64.store offset=16
     global.get $~lib/memory/__stack_pointer
     local.get $7
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $6
     i32.store offset=8
     local.get $7
     local.get $6
     i32.store
     local.get $7
     local.get $6
     i32.const 0
     call $~lib/rt/itcms/__link
     global.get $~lib/memory/__stack_pointer
     local.get $7
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     i32.const 3
     i32.const 2
     i32.const 12
     call $~lib/rt/__newArray
     local.tee $6
     i32.store offset=16
     global.get $~lib/memory/__stack_pointer
     local.get $6
     i32.load offset=4
     i32.store offset=20
     local.get $6
     i32.const 0
     local.get $0
     call $~lib/array/Array<u32>#__set
     local.get $6
     i32.const 1
     local.get $1
     call $~lib/array/Array<u32>#__set
     local.get $6
     i32.const 2
     local.get $2
     call $~lib/array/Array<u32>#__set
     global.get $~lib/memory/__stack_pointer
     local.get $6
     i32.store offset=12
     global.get $~lib/memory/__stack_pointer
     i32.const 8
     i32.sub
     global.set $~lib/memory/__stack_pointer
     global.get $~lib/memory/__stack_pointer
     i32.const 24348
     i32.lt_s
     br_if $folding-inner0
     global.get $~lib/memory/__stack_pointer
     i64.const 0
     i64.store
     global.get $~lib/memory/__stack_pointer
     local.get $6
     i32.store
     local.get $6
     call $~lib/array/Array<f64>#get:length
     i32.const 2
     i32.shl
     local.set $8
     global.get $~lib/memory/__stack_pointer
     local.get $8
     i32.const 5
     call $~lib/rt/itcms/__new
     local.tee $9
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $6
     i32.store
     local.get $9
     local.get $6
     i32.load offset=4
     local.get $8
     memory.copy
     global.get $~lib/memory/__stack_pointer
     i32.const 8
     i32.add
     global.set $~lib/memory/__stack_pointer
     global.get $~lib/memory/__stack_pointer
     local.get $9
     i32.store offset=8
     local.get $7
     local.get $9
     i32.store offset=4
     local.get $7
     local.get $9
     i32.const 0
     call $~lib/rt/itcms/__link
     global.get $~lib/memory/__stack_pointer
     local.get $7
     i32.store offset=4
     call $~lib/array/Array<f64>#constructor
     local.set $6
     global.get $~lib/memory/__stack_pointer
     local.get $6
     i32.store offset=8
     local.get $7
     local.get $6
     i32.store offset=8
     local.get $7
     local.get $6
     i32.const 0
     call $~lib/rt/itcms/__link
     global.get $~lib/memory/__stack_pointer
     local.get $7
     i32.store offset=4
     local.get $7
     f64.const 0
     f64.store offset=16
     global.get $~lib/memory/__stack_pointer
     i32.const 24
     i32.add
     global.set $~lib/memory/__stack_pointer
     local.get $7
     br $__inlined_func$assembly/resonlang/EntangledNode#constructor$11
    end
    br $folding-inner1
   end
   local.tee $6
   i32.store offset=24
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.load offset=8
   local.tee $7
   i32.store offset=12
   local.get $7
   local.get $0
   f64.convert_i32_u
   local.tee $3
   f64.const 3.141592653589793
   f64.mul
   f64.const 100
   f64.div
   call $~lib/array/Array<f64>#push
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.load offset=8
   local.tee $0
   i32.store offset=12
   local.get $0
   local.get $1
   f64.convert_i32_u
   local.tee $4
   f64.const 3.141592653589793
   f64.mul
   f64.const 100
   f64.div
   call $~lib/array/Array<f64>#push
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.load offset=8
   local.tee $0
   i32.store offset=12
   local.get $0
   local.get $2
   f64.convert_i32_u
   local.tee $5
   f64.const 3.141592653589793
   f64.mul
   f64.const 100
   f64.div
   call $~lib/array/Array<f64>#push
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store offset=12
   local.get $6
   local.get $3
   local.get $4
   f64.add
   local.get $5
   f64.add
   f64.const 200
   f64.div
   f64.const 1
   f64.min
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   i32.const 28
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $6
   return
  end
  i32.const 57136
  i32.const 57184
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $~lib/staticarray/StaticArray<u32>#__get (param $0 i32) (param $1 i32) (result i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $1
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const 2
  i32.shr_u
  i32.ge_u
  if
   i32.const 1456
   i32.const 13984
   i32.const 78
   i32.const 41
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  i32.load
  local.set $0
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $~lib/array/Array<f64>#map<~lib/string/String> (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 f64)
  (local $7 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 16
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load offset=12
  local.tee $4
  i32.const 2
  i32.const 13
  call $~lib/rt/__newArray
  local.tee $3
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $3
  i32.store
  local.get $3
  i32.load offset=4
  local.set $5
  loop $for-loop|0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $2
   local.get $4
   local.get $0
   i32.load offset=12
   local.tee $7
   local.get $4
   local.get $7
   i32.lt_s
   select
   i32.lt_s
   if
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=8
    local.get $0
    i32.load offset=4
    local.get $2
    i32.const 3
    i32.shl
    i32.add
    f64.load
    local.set $6
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $6
    local.get $2
    local.get $0
    local.get $1
    i32.load
    call_indirect (type $13)
    local.tee $7
    i32.store offset=12
    local.get $5
    local.get $2
    i32.const 2
    i32.shl
    i32.add
    local.get $7
    i32.store
    local.get $3
    local.get $7
    i32.const 1
    call $~lib/rt/itcms/__link
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 16
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $3
 )
 (func $~lib/array/Array<~lib/string/String>#join (param $0 i32) (result i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load offset=4
  local.set $1
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load offset=12
  local.set $0
  global.get $~lib/memory/__stack_pointer
  i32.const 6064
  i32.store
  local.get $1
  local.get $0
  i32.const 6064
  call $~lib/util/string/joinStringArray
  local.set $0
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $assembly/resonlang/EntangledNode#toString (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 44
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.const 44
  memory.fill
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load
  local.tee $1
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load offset=4
  local.tee $2
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.const 0
  call $~lib/staticarray/StaticArray<u32>#__get
  call $~lib/util/number/utoa32
  local.tee $3
  i32.store offset=12
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load offset=4
  local.tee $2
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.const 1
  call $~lib/staticarray/StaticArray<u32>#__get
  call $~lib/util/number/utoa32
  local.tee $4
  i32.store offset=16
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load offset=4
  local.tee $2
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.const 2
  call $~lib/staticarray/StaticArray<u32>#__get
  call $~lib/util/number/utoa32
  local.tee $5
  i32.store offset=20
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  f64.load offset=16
  i32.const 4
  call $assembly/utils/toFixed
  local.tee $6
  i32.store offset=24
  global.get $~lib/memory/__stack_pointer
  local.set $2
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=36
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load offset=8
  local.tee $0
  i32.store offset=28
  global.get $~lib/memory/__stack_pointer
  i32.const 16112
  i32.store offset=32
  local.get $0
  i32.const 16112
  call $~lib/array/Array<f64>#map<~lib/string/String>
  local.set $0
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  i32.const 6064
  i32.store offset=8
  local.get $2
  local.get $0
  call $~lib/array/Array<~lib/string/String>#join
  local.tee $0
  i32.store offset=40
  global.get $~lib/memory/__stack_pointer
  i32.const 16032
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=8
  i32.const 16036
  local.get $1
  i32.store
  i32.const 16032
  local.get $1
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 16032
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $3
  i32.store offset=8
  i32.const 16044
  local.get $3
  i32.store
  i32.const 16032
  local.get $3
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 16032
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=8
  i32.const 16052
  local.get $4
  i32.store
  i32.const 16032
  local.get $4
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 16032
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $5
  i32.store offset=8
  i32.const 16060
  local.get $5
  i32.store
  i32.const 16032
  local.get $5
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 16032
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $6
  i32.store offset=8
  i32.const 16068
  local.get $6
  i32.store
  i32.const 16032
  local.get $6
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 16032
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=8
  i32.const 16076
  local.get $0
  i32.store
  i32.const 16032
  local.get $0
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 16032
  i32.store
  global.get $~lib/memory/__stack_pointer
  i32.const 13920
  i32.store offset=8
  i32.const 16032
  call $~lib/staticarray/StaticArray<~lib/string/String>#join
  local.set $0
  global.get $~lib/memory/__stack_pointer
  i32.const 44
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $assembly/operators/tensor (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 f64)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 f64)
  (local $10 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 24
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 24348
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.const 24
   memory.fill
   global.get $~lib/memory/__stack_pointer
   call $"~lib/map/Map<u32,f64>#constructor"
   local.tee $2
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load
   local.tee $6
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $6
   call $"~lib/map/Map<u32,f64>#keys"
   local.tee $7
   i32.store offset=12
   loop $for-loop|0
    global.get $~lib/memory/__stack_pointer
    local.get $7
    i32.store offset=4
    local.get $7
    call $~lib/array/Array<f64>#get:length
    local.get $3
    i32.gt_s
    if
     global.get $~lib/memory/__stack_pointer
     local.get $7
     i32.store offset=4
     local.get $7
     local.get $3
     call $~lib/array/Array<u32>#__get
     local.set $8
     global.get $~lib/memory/__stack_pointer
     local.get $2
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=16
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load
     local.tee $6
     i32.store offset=8
     local.get $2
     local.get $8
     local.get $6
     local.get $8
     call $"~lib/map/Map<u32,f64>#get"
     call $"~lib/map/Map<u32,f64>#set"
     local.get $3
     i32.const 1
     i32.add
     local.set $3
     br $for-loop|0
    end
   end
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.load
   local.tee $3
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $3
   call $"~lib/map/Map<u32,f64>#keys"
   local.tee $3
   i32.store offset=20
   loop $for-loop|1
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.store offset=4
    local.get $3
    call $~lib/array/Array<f64>#get:length
    local.get $4
    i32.gt_s
    if
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store offset=4
     local.get $3
     local.get $4
     call $~lib/array/Array<u32>#__get
     local.set $6
     global.get $~lib/memory/__stack_pointer
     local.get $2
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     i32.const 4
     i32.sub
     global.set $~lib/memory/__stack_pointer
     global.get $~lib/memory/__stack_pointer
     i32.const 24348
     i32.lt_s
     br_if $folding-inner0
     global.get $~lib/memory/__stack_pointer
     i32.const 0
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $2
     i32.store
     local.get $2
     local.get $6
     local.get $6
     i32.const -1028477379
     i32.mul
     i32.const 374761397
     i32.add
     i32.const 17
     i32.rotl
     i32.const 668265263
     i32.mul
     local.tee $7
     local.get $7
     i32.const 15
     i32.shr_u
     i32.xor
     i32.const -2048144777
     i32.mul
     local.tee $7
     local.get $7
     i32.const 13
     i32.shr_u
     i32.xor
     i32.const -1028477379
     i32.mul
     local.tee $7
     local.get $7
     i32.const 16
     i32.shr_u
     i32.xor
     call $"~lib/map/Map<u32,f64>#find"
     i32.const 0
     i32.ne
     local.set $7
     global.get $~lib/memory/__stack_pointer
     i32.const 4
     i32.add
     global.set $~lib/memory/__stack_pointer
     local.get $7
     if
      global.get $~lib/memory/__stack_pointer
      local.get $2
      i32.store offset=4
      global.get $~lib/memory/__stack_pointer
      local.get $2
      i32.store offset=8
      local.get $2
      local.get $6
      call $"~lib/map/Map<u32,f64>#get"
      local.set $5
      global.get $~lib/memory/__stack_pointer
      local.get $1
      i32.store offset=16
      global.get $~lib/memory/__stack_pointer
      local.get $1
      i32.load
      local.tee $7
      i32.store offset=8
      local.get $2
      local.get $6
      local.get $5
      local.get $7
      local.get $6
      call $"~lib/map/Map<u32,f64>#get"
      f64.add
      call $"~lib/map/Map<u32,f64>#set"
     else
      global.get $~lib/memory/__stack_pointer
      local.get $2
      i32.store offset=4
      global.get $~lib/memory/__stack_pointer
      local.get $1
      i32.store offset=16
      global.get $~lib/memory/__stack_pointer
      local.get $1
      i32.load
      local.tee $7
      i32.store offset=8
      local.get $2
      local.get $6
      local.get $7
      local.get $6
      call $"~lib/map/Map<u32,f64>#get"
      call $"~lib/map/Map<u32,f64>#set"
     end
     local.get $4
     i32.const 1
     i32.add
     local.set $4
     br $for-loop|1
    end
   end
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load offset=4
   local.tee $3
   i32.store offset=4
   local.get $3
   i32.const 0
   call $~lib/staticarray/StaticArray<f64>#__get
   local.set $5
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.load offset=4
   local.tee $3
   i32.store offset=4
   local.get $5
   local.get $3
   i32.const 0
   call $~lib/staticarray/StaticArray<f64>#__get
   f64.add
   f64.const 0.5
   f64.mul
   local.set $5
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load offset=4
   local.tee $3
   i32.store offset=4
   local.get $3
   i32.const 1
   call $~lib/staticarray/StaticArray<f64>#__get
   local.set $9
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.load offset=4
   local.tee $3
   i32.store offset=4
   local.get $9
   local.get $3
   i32.const 1
   call $~lib/staticarray/StaticArray<f64>#__get
   f64.add
   f64.const 0.5
   f64.mul
   local.set $9
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   f64.load offset=8
   local.set $10
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store offset=4
   local.get $10
   local.get $1
   f64.load offset=8
   f64.add
   f64.const 0.5
   f64.mul
   local.set $10
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   local.get $5
   local.get $9
   local.get $10
   call $assembly/resonlang/ResonantFragment#constructor
   local.set $0
   global.get $~lib/memory/__stack_pointer
   i32.const 24
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $0
   return
  end
  i32.const 57136
  i32.const 57184
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $assembly/operators/collapse (param $0 i32) (result i32)
  (local $1 f64)
  (local $2 i32)
  (local $3 i32)
  (local $4 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  f64.load offset=8
  f64.const 0.1
  f64.mul
  local.set $1
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load
  local.tee $2
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load offset=4
  local.tee $3
  i32.store offset=4
  local.get $3
  i32.const 0
  call $~lib/staticarray/StaticArray<f64>#__get
  local.set $4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load offset=4
  local.tee $0
  i32.store offset=4
  local.get $2
  local.get $4
  local.get $0
  i32.const 1
  call $~lib/staticarray/StaticArray<f64>#__get
  local.get $1
  call $assembly/resonlang/ResonantFragment#constructor
  local.set $0
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $~lib/array/Array<f64>#__get (param $0 i32) (param $1 i32) (result f64)
  (local $2 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $1
  local.get $0
  i32.load offset=12
  i32.ge_u
  if
   i32.const 1456
   i32.const 5888
   i32.const 114
   i32.const 42
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load offset=4
  local.get $1
  i32.const 3
  i32.shl
  i32.add
  f64.load
  local.set $2
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $2
 )
 (func $assembly/operators/linkEntanglement (param $0 i32) (param $1 i32)
  (local $2 f64)
  (local $3 i32)
  (local $4 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 40
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.const 40
  memory.fill
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  f64.load offset=16
  local.set $2
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store
  local.get $2
  local.get $1
  f64.load offset=16
  f64.add
  f64.const 0.5
  f64.mul
  local.tee $2
  f64.const 0.85
  f64.gt
  if (result i32)
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=16
   f64.const 0.05
   f64.add
   f64.const 1
   f64.min
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store offset=4
   local.get $1
   local.get $1
   f64.load offset=16
   f64.const 0.05
   f64.add
   f64.const 1
   f64.min
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load
   local.tee $3
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.load
   local.tee $4
   i32.store offset=12
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   f64.load offset=16
   i32.const 4
   call $assembly/utils/toFixed
   local.tee $0
   i32.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $1
   f64.load offset=16
   i32.const 4
   call $assembly/utils/toFixed
   local.tee $1
   i32.store offset=20
   global.get $~lib/memory/__stack_pointer
   i32.const 17664
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store offset=24
   i32.const 17668
   local.get $3
   i32.store
   i32.const 17664
   local.get $3
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 17664
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store offset=24
   i32.const 17676
   local.get $4
   i32.store
   i32.const 17664
   local.get $4
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 17664
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=24
   i32.const 17684
   local.get $0
   i32.store
   i32.const 17664
   local.get $0
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 17664
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store offset=24
   i32.const 17692
   local.get $1
   i32.store
   i32.const 17664
   local.get $1
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 17664
   i32.store offset=4
   i32.const 17664
  else
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load
   local.tee $0
   i32.store offset=28
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.load
   local.tee $1
   i32.store offset=32
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.const 4
   call $assembly/utils/toFixed
   local.tee $3
   i32.store offset=36
   global.get $~lib/memory/__stack_pointer
   i32.const 17840
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=24
   i32.const 17844
   local.get $0
   i32.store
   i32.const 17840
   local.get $0
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 17840
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store offset=24
   i32.const 17852
   local.get $1
   i32.store
   i32.const 17840
   local.get $1
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 17840
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store offset=24
   i32.const 17860
   local.get $3
   i32.store
   i32.const 17840
   local.get $3
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 17840
   i32.store offset=4
   i32.const 17840
  end
  local.set $0
  global.get $~lib/memory/__stack_pointer
  i32.const 13920
  i32.store offset=24
  local.get $0
  call $~lib/staticarray/StaticArray<~lib/string/String>#join
  local.set $0
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  call $~lib/console/console.log
  global.get $~lib/memory/__stack_pointer
  i32.const 40
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/array/Array<assembly/resonlang/EntangledNode>#__set (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $1
  local.get $0
  i32.load offset=12
  i32.ge_u
  if
   local.get $1
   i32.const 0
   i32.lt_s
   if
    i32.const 1456
    i32.const 5888
    i32.const 130
    i32.const 22
    call $~lib/builtins/abort
    unreachable
   end
   local.get $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $3
   i32.const 2
   i32.const 1
   call $~lib/array/ensureCapacity
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   local.get $3
   i32.store offset=12
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load offset=4
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  local.get $2
  i32.store
  local.get $0
  local.get $2
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/operators/route~anonymous|0 (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load
  local.set $0
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $~lib/array/Array<assembly/resonlang/EntangledNode>#__get (param $0 i32) (param $1 i32) (result i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $1
  local.get $0
  i32.load offset=12
  i32.ge_u
  if
   i32.const 1456
   i32.const 5888
   i32.const 114
   i32.const 42
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load offset=4
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  i32.load
  local.tee $0
  i32.store offset=4
  local.get $0
  i32.eqz
  if
   i32.const 18608
   i32.const 5888
   i32.const 118
   i32.const 40
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $assembly/operators/route (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 48
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner1
   block $folding-inner0
    global.get $~lib/memory/__stack_pointer
    i32.const 24348
    i32.lt_s
    br_if $folding-inner0
    global.get $~lib/memory/__stack_pointer
    i32.const 0
    i32.const 48
    memory.fill
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.load
    local.tee $4
    i32.store offset=8
    global.get $~lib/memory/__stack_pointer
    local.get $1
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $1
    i32.load
    local.tee $5
    i32.store offset=12
    global.get $~lib/memory/__stack_pointer
    local.set $7
    global.get $~lib/memory/__stack_pointer
    local.get $2
    i32.store offset=20
    global.get $~lib/memory/__stack_pointer
    i32.const 18320
    i32.store offset=24
    global.get $~lib/memory/__stack_pointer
    i32.const 20
    i32.sub
    global.set $~lib/memory/__stack_pointer
    global.get $~lib/memory/__stack_pointer
    i32.const 24348
    i32.lt_s
    br_if $folding-inner0
    global.get $~lib/memory/__stack_pointer
    i32.const 0
    i32.const 20
    memory.fill
    global.get $~lib/memory/__stack_pointer
    local.get $2
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $2
    i32.load offset=12
    local.tee $6
    i32.const 2
    i32.const 13
    call $~lib/rt/__newArray
    local.tee $9
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $9
    i32.store
    local.get $9
    i32.load offset=4
    local.set $8
    loop $for-loop|0
     global.get $~lib/memory/__stack_pointer
     local.get $2
     i32.store
     local.get $3
     local.get $6
     local.get $2
     i32.load offset=12
     local.tee $10
     local.get $6
     local.get $10
     i32.lt_s
     select
     i32.lt_s
     if
      global.get $~lib/memory/__stack_pointer
      local.get $2
      i32.store offset=12
      global.get $~lib/memory/__stack_pointer
      local.get $3
      i32.const 2
      i32.shl
      local.tee $10
      local.get $2
      i32.load offset=4
      i32.add
      i32.load
      local.tee $11
      i32.store
      global.get $~lib/memory/__stack_pointer
      local.get $2
      i32.store offset=8
      global.get $~lib/memory/__stack_pointer
      local.get $11
      local.get $3
      local.get $2
      i32.const 18320
      i32.load
      call_indirect (type $3)
      local.tee $11
      i32.store offset=16
      local.get $8
      local.get $10
      i32.add
      local.get $11
      i32.store
      local.get $9
      local.get $11
      i32.const 1
      call $~lib/rt/itcms/__link
      local.get $3
      i32.const 1
      i32.add
      local.set $3
      br $for-loop|0
     end
    end
    global.get $~lib/memory/__stack_pointer
    i32.const 20
    i32.add
    global.set $~lib/memory/__stack_pointer
    global.get $~lib/memory/__stack_pointer
    local.get $9
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    i32.const 6064
    i32.store offset=16
    local.get $7
    local.get $9
    call $~lib/array/Array<~lib/string/String>#join
    local.tee $3
    i32.store offset=28
    global.get $~lib/memory/__stack_pointer
    i32.const 18272
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $4
    i32.store offset=16
    i32.const 18276
    local.get $4
    i32.store
    i32.const 18272
    local.get $4
    i32.const 1
    call $~lib/rt/itcms/__link
    global.get $~lib/memory/__stack_pointer
    i32.const 18272
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $5
    i32.store offset=16
    i32.const 18284
    local.get $5
    i32.store
    i32.const 18272
    local.get $5
    i32.const 1
    call $~lib/rt/itcms/__link
    global.get $~lib/memory/__stack_pointer
    i32.const 18272
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.store offset=16
    i32.const 18292
    local.get $3
    i32.store
    i32.const 18272
    local.get $3
    i32.const 1
    call $~lib/rt/itcms/__link
    global.get $~lib/memory/__stack_pointer
    i32.const 18272
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    i32.const 13920
    i32.store offset=16
    i32.const 18272
    call $~lib/staticarray/StaticArray<~lib/string/String>#join
    local.set $3
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.store
    local.get $3
    call $~lib/console/console.log
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    local.get $0
    f64.load offset=16
    f64.const 0.5
    f64.lt
    if (result i32)
     i32.const 1
    else
     global.get $~lib/memory/__stack_pointer
     local.get $1
     i32.store
     local.get $1
     f64.load offset=16
     f64.const 0.5
     f64.lt
    end
    if
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.load
     local.tee $0
     i32.store offset=32
     global.get $~lib/memory/__stack_pointer
     local.get $1
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $1
     i32.load
     local.tee $1
     i32.store offset=36
     global.get $~lib/memory/__stack_pointer
     i32.const 18560
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store offset=16
     i32.const 18564
     local.get $0
     i32.store
     i32.const 18560
     local.get $0
     i32.const 1
     call $~lib/rt/itcms/__link
     global.get $~lib/memory/__stack_pointer
     i32.const 18560
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $1
     i32.store offset=16
     i32.const 18572
     local.get $1
     i32.store
     i32.const 18560
     local.get $1
     i32.const 1
     call $~lib/rt/itcms/__link
     i32.const 18560
     local.set $0
     global.get $~lib/memory/__stack_pointer
     i32.const 18560
     i32.store offset=4
     br $folding-inner1
    end
    i32.const 0
    local.set $1
    loop $for-loop|00
     global.get $~lib/memory/__stack_pointer
     local.get $2
     i32.store
     local.get $2
     call $~lib/array/Array<f64>#get:length
     local.get $1
     i32.gt_s
     if
      global.get $~lib/memory/__stack_pointer
      local.get $2
      i32.store offset=4
      local.get $2
      local.get $1
      call $~lib/array/Array<assembly/resonlang/EntangledNode>#__get
      local.set $0
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store
      local.get $0
      f64.load offset=16
      f64.const 0.7
      f64.lt
      if
       global.get $~lib/memory/__stack_pointer
       local.set $0
       global.get $~lib/memory/__stack_pointer
       local.get $2
       i32.store offset=16
       local.get $2
       local.get $1
       call $~lib/array/Array<assembly/resonlang/EntangledNode>#__get
       local.set $3
       global.get $~lib/memory/__stack_pointer
       local.get $3
       i32.store offset=4
       local.get $0
       local.get $3
       i32.load
       local.tee $0
       i32.store offset=40
       global.get $~lib/memory/__stack_pointer
       local.set $3
       global.get $~lib/memory/__stack_pointer
       local.get $2
       i32.store offset=16
       local.get $2
       local.get $1
       call $~lib/array/Array<assembly/resonlang/EntangledNode>#__get
       local.set $1
       global.get $~lib/memory/__stack_pointer
       local.get $1
       i32.store offset=4
       local.get $3
       local.get $1
       f64.load offset=16
       i32.const 4
       call $assembly/utils/toFixed
       local.tee $1
       i32.store offset=44
       global.get $~lib/memory/__stack_pointer
       i32.const 18944
       i32.store offset=4
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store offset=16
       i32.const 18948
       local.get $0
       i32.store
       i32.const 18944
       local.get $0
       i32.const 1
       call $~lib/rt/itcms/__link
       global.get $~lib/memory/__stack_pointer
       i32.const 18944
       i32.store offset=4
       global.get $~lib/memory/__stack_pointer
       local.get $1
       i32.store offset=16
       i32.const 18956
       local.get $1
       i32.store
       i32.const 18944
       local.get $1
       i32.const 1
       call $~lib/rt/itcms/__link
       i32.const 18944
       local.set $0
       global.get $~lib/memory/__stack_pointer
       i32.const 18944
       i32.store offset=4
       br $folding-inner1
      end
      local.get $1
      i32.const 1
      i32.add
      local.set $1
      br $for-loop|00
     end
    end
    global.get $~lib/memory/__stack_pointer
    i32.const 18992
    i32.store
    i32.const 18992
    call $~lib/console/console.log
    global.get $~lib/memory/__stack_pointer
    i32.const 48
    i32.add
    global.set $~lib/memory/__stack_pointer
    i32.const 1
    return
   end
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 13920
  i32.store offset=16
  local.get $0
  call $~lib/staticarray/StaticArray<~lib/string/String>#join
  local.set $0
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  call $~lib/console/console.log
  global.get $~lib/memory/__stack_pointer
  i32.const 48
  i32.add
  global.set $~lib/memory/__stack_pointer
  i32.const 0
 )
 (func $assembly/utils/entropyRate (param $0 i32) (result f64)
  (local $1 i32)
  (local $2 f64)
  (local $3 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  call $~lib/array/Array<f64>#get:length
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   f64.const 0
   return
  end
  loop $for-loop|0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   call $~lib/array/Array<f64>#get:length
   local.get $1
   i32.gt_s
   if
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    local.get $1
    f64.convert_i32_s
    f64.const 1
    f64.add
    f64.const 3.141592653589793
    f64.mul
    local.get $0
    call $~lib/array/Array<f64>#get:length
    f64.convert_i32_s
    f64.div
    local.set $3
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    local.get $2
    local.get $0
    local.get $1
    call $~lib/array/Array<f64>#__get
    local.get $3
    f64.sub
    f64.const 2
    call $~lib/math/NativeMath.pow
    f64.add
    local.set $2
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $2
  local.get $0
  call $~lib/array/Array<f64>#get:length
  f64.convert_i32_s
  f64.div
  f64.sqrt
  f64.neg
  local.set $2
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $2
 )
 (func $assembly/operators/coherence (param $0 i32) (result f64)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  f64.load offset=16
  local.set $1
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $1
 )
 (func $assembly/functionalBlocks/stabilize (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 f64)
  (local $3 i32)
  (local $4 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 36
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.const 36
  memory.fill
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load offset=8
  local.tee $1
  i32.store
  local.get $1
  call $assembly/utils/entropyRate
  local.set $2
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load
  local.tee $3
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.const 4
  call $assembly/utils/toFixed
  local.tee $4
  i32.store offset=12
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  call $assembly/operators/coherence
  i32.const 4
  call $assembly/utils/toFixed
  local.tee $1
  i32.store offset=16
  global.get $~lib/memory/__stack_pointer
  i32.const 19568
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $3
  i32.store offset=20
  i32.const 19572
  local.get $3
  i32.store
  i32.const 19568
  local.get $3
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 19568
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=20
  i32.const 19580
  local.get $4
  i32.store
  i32.const 19568
  local.get $4
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 19568
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=20
  i32.const 19588
  local.get $1
  i32.store
  i32.const 19568
  local.get $1
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 19568
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  i32.const 13920
  i32.store offset=20
  i32.const 19568
  call $~lib/staticarray/StaticArray<~lib/string/String>#join
  local.set $1
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store
  local.get $1
  call $~lib/console/console.log
  local.get $2
  f64.const -0.03
  f64.lt
  if (result i32)
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   call $assembly/operators/coherence
   f64.const 0.9
   f64.gt
  else
   i32.const 0
  end
  if
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   local.get $0
   local.get $0
   f64.load offset=16
   f64.const 0.05
   f64.add
   f64.const 1
   f64.min
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load
   local.tee $1
   i32.store offset=24
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   f64.load offset=16
   i32.const 4
   call $assembly/utils/toFixed
   local.tee $0
   i32.store offset=28
   global.get $~lib/memory/__stack_pointer
   i32.const 19728
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store offset=20
   i32.const 19732
   local.get $1
   i32.store
   i32.const 19728
   local.get $1
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 19728
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=20
   i32.const 19740
   local.get $0
   i32.store
   i32.const 19728
   local.get $0
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 19728
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   i32.const 13920
   i32.store offset=20
   i32.const 19728
   call $~lib/staticarray/StaticArray<~lib/string/String>#join
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 36
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const 1
   return
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.load
  local.tee $0
  i32.store offset=32
  global.get $~lib/memory/__stack_pointer
  i32.const 19904
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=20
  i32.const 19908
  local.get $0
  i32.store
  i32.const 19904
  local.get $0
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 19904
  i32.store offset=4
  global.get $~lib/memory/__stack_pointer
  i32.const 13920
  i32.store offset=20
  i32.const 19904
  call $~lib/staticarray/StaticArray<~lib/string/String>#join
  local.set $0
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  call $~lib/console/console.log
  global.get $~lib/memory/__stack_pointer
  i32.const 36
  i32.add
  global.set $~lib/memory/__stack_pointer
  i32.const 0
 )
 (func $assembly/functionalBlocks/teleport (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 48
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.const 48
  memory.fill
  global.get $assembly/resonlang/currentNode
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 20064
   i32.store
   i32.const 20064
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 48
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const 0
   return
  end
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/resonlang/currentNode
  local.tee $2
  i32.store offset=4
  local.get $2
  i32.eqz
  if
   i32.const 16512
   i32.const 20208
   i32.const 50
   i32.const 34
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store
  local.get $2
  call $assembly/operators/coherence
  f64.const 0.8
  f64.gt
  local.tee $2
  if
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store
   local.get $1
   call $assembly/operators/coherence
   f64.const 0.8
   f64.gt
   local.set $2
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $0
  f64.load offset=8
  i32.const 4
  call $assembly/utils/toFixed
  local.tee $3
  i32.store offset=12
  global.get $~lib/memory/__stack_pointer
  local.set $4
  global.get $~lib/memory/__stack_pointer
  global.get $assembly/resonlang/currentNode
  local.tee $5
  i32.store offset=16
  local.get $5
  i32.eqz
  if
   i32.const 16512
   i32.const 20208
   i32.const 52
   i32.const 98
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.get $5
  i32.store offset=8
  local.get $4
  local.get $5
  i32.load
  local.tee $4
  i32.store offset=20
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.load
  local.tee $5
  i32.store offset=24
  global.get $~lib/memory/__stack_pointer
  i32.const 19936
  i32.const 19968
  local.get $2
  select
  local.tee $6
  i32.store offset=28
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $1
  call $assembly/operators/coherence
  i32.const 4
  call $assembly/utils/toFixed
  local.tee $7
  i32.store offset=32
  global.get $~lib/memory/__stack_pointer
  i32.const 20576
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $3
  i32.store offset=36
  i32.const 20580
  local.get $3
  i32.store
  i32.const 20576
  local.get $3
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 20576
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=36
  i32.const 20588
  local.get $4
  i32.store
  i32.const 20576
  local.get $4
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 20576
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $5
  i32.store offset=36
  i32.const 20596
  local.get $5
  i32.store
  i32.const 20576
  local.get $5
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 20576
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $6
  i32.store offset=36
  i32.const 20604
  local.get $6
  i32.store
  i32.const 20576
  local.get $6
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 20576
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $7
  i32.store offset=36
  i32.const 20612
  local.get $7
  i32.store
  i32.const 20576
  local.get $7
  i32.const 1
  call $~lib/rt/itcms/__link
  global.get $~lib/memory/__stack_pointer
  i32.const 20576
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  i32.const 13920
  i32.store offset=36
  i32.const 20576
  call $~lib/staticarray/StaticArray<~lib/string/String>#join
  local.set $3
  global.get $~lib/memory/__stack_pointer
  local.get $3
  i32.store
  local.get $3
  call $~lib/console/console.log
  local.get $2
  if (result i32)
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store
   local.get $1
   call $assembly/operators/coherence
   f64.const 0.85
   f64.gt
  else
   i32.const 0
  end
  if
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   call $assembly/resonlang/ResonantFragment#toString
   local.tee $0
   i32.store offset=40
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.load
   local.tee $1
   i32.store offset=44
   global.get $~lib/memory/__stack_pointer
   i32.const 20816
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=36
   i32.const 20820
   local.get $0
   i32.store
   i32.const 20816
   local.get $0
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 20816
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store offset=36
   i32.const 20828
   local.get $1
   i32.store
   i32.const 20816
   local.get $1
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 20816
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   i32.const 13920
   i32.store offset=36
   i32.const 20816
   call $~lib/staticarray/StaticArray<~lib/string/String>#join
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 48
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const 1
   return
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 20864
  i32.store
  i32.const 20864
  call $~lib/console/console.log
  global.get $~lib/memory/__stack_pointer
  i32.const 48
  i32.add
  global.set $~lib/memory/__stack_pointer
  i32.const 0
 )
 (func $assembly/operators/entropy (param $0 i32) (result f64)
  (local $1 f64)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  f64.load offset=8
  local.set $1
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $1
 )
 (func $~lib/array/Array<u32>#push (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  local.get $0
  i32.load offset=12
  local.tee $2
  i32.const 1
  i32.add
  local.tee $3
  i32.const 2
  i32.const 1
  call $~lib/array/ensureCapacity
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  i32.load offset=4
  local.get $2
  i32.const 2
  i32.shl
  i32.add
  local.get $1
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store
  local.get $0
  local.get $3
  i32.store offset=12
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/resonlang/Attractor.create (param $0 i32) (param $1 f64) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 20
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 24348
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.const 20
   memory.fill
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   call $~lib/array/Array<u32>#constructor
   local.tee $3
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store offset=4
   local.get $3
   i32.const 13
   call $~lib/array/Array<u32>#push
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store offset=4
   local.get $3
   i32.const 43
   call $~lib/array/Array<u32>#push
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store offset=4
   local.get $3
   i32.const 67
   call $~lib/array/Array<u32>#push
   global.get $~lib/memory/__stack_pointer
   call $~lib/array/Array<f64>#constructor
   local.tee $4
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store offset=4
   local.get $4
   f64.const 1.5707963267948966
   call $~lib/array/Array<f64>#push
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store offset=4
   local.get $4
   f64.const 3.141592653589793
   call $~lib/array/Array<f64>#push
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store offset=4
   local.get $4
   f64.const 4.71238898038469
   call $~lib/array/Array<f64>#push
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store offset=12
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store offset=16
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 24348
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   i32.const 24
   i32.const 17
   call $~lib/rt/itcms/__new
   local.tee $2
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   i32.const 0
   i32.store
   local.get $2
   i32.const 0
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   i32.const 0
   i32.store offset=4
   local.get $2
   i32.const 0
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   i32.const 0
   i32.store offset=8
   local.get $2
   i32.const 0
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   f64.const 0
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=8
   local.get $2
   local.get $0
   i32.store offset=8
   local.get $2
   local.get $0
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store offset=8
   local.get $2
   local.get $3
   i32.store
   local.get $2
   local.get $3
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store offset=8
   local.get $2
   local.get $4
   i32.store offset=4
   local.get $2
   local.get $4
   i32.const 0
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   local.get $1
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 20
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $2
   return
  end
  i32.const 57136
  i32.const 57184
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $~lib/util/string/joinIntegerArray<u32> (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner1
   block $folding-inner0
    global.get $~lib/memory/__stack_pointer
    i32.const 24348
    i32.lt_s
    br_if $folding-inner0
    global.get $~lib/memory/__stack_pointer
    i64.const 0
    i64.store
    local.get $1
    i32.const 1
    i32.sub
    local.tee $5
    i32.const 0
    i32.lt_s
    if
     global.get $~lib/memory/__stack_pointer
     i32.const 8
     i32.add
     global.set $~lib/memory/__stack_pointer
     i32.const 13920
     return
    end
    local.get $5
    i32.eqz
    if
     local.get $0
     i32.load
     call $~lib/util/number/utoa32
     local.set $1
     br $folding-inner1
    end
    global.get $~lib/memory/__stack_pointer
    i32.const 6064
    i32.store
    global.get $~lib/memory/__stack_pointer
    i32.const 6060
    i32.load
    i32.const 1
    i32.shr_u
    local.tee $4
    i32.const 10
    i32.add
    local.get $5
    i32.mul
    i32.const 10
    i32.add
    local.tee $3
    i32.const 1
    i32.shl
    i32.const 2
    call $~lib/rt/itcms/__new
    local.tee $1
    i32.store offset=4
    loop $for-loop|0
     local.get $5
     local.get $6
     i32.gt_s
     if
      local.get $1
      local.get $2
      i32.const 1
      i32.shl
      i32.add
      local.get $0
      local.get $6
      i32.const 2
      i32.shl
      i32.add
      i32.load
      call $~lib/util/number/itoa_buffered<u32>
      local.get $2
      i32.add
      local.set $2
      local.get $4
      if
       local.get $1
       local.get $2
       i32.const 1
       i32.shl
       i32.add
       i32.const 6064
       local.get $4
       i32.const 1
       i32.shl
       memory.copy
       local.get $2
       local.get $4
       i32.add
       local.set $2
      end
      local.get $6
      i32.const 1
      i32.add
      local.set $6
      br $for-loop|0
     end
    end
    local.get $1
    local.get $2
    i32.const 1
    i32.shl
    i32.add
    local.get $0
    local.get $5
    i32.const 2
    i32.shl
    i32.add
    i32.load
    call $~lib/util/number/itoa_buffered<u32>
    local.get $2
    i32.add
    local.tee $0
    local.get $3
    i32.lt_s
    if
     global.get $~lib/memory/__stack_pointer
     local.get $1
     i32.store
     global.get $~lib/memory/__stack_pointer
     i32.const 8
     i32.sub
     global.set $~lib/memory/__stack_pointer
     global.get $~lib/memory/__stack_pointer
     i32.const 24348
     i32.lt_s
     br_if $folding-inner0
     global.get $~lib/memory/__stack_pointer
     i64.const 0
     i64.store
     global.get $~lib/memory/__stack_pointer
     local.get $1
     i32.store
     local.get $0
     i32.const 0
     local.get $0
     i32.const 0
     i32.gt_s
     select
     local.tee $0
     local.get $1
     i32.const 20
     i32.sub
     i32.load offset=16
     i32.const 1
     i32.shr_u
     local.tee $4
     local.get $0
     local.get $4
     i32.lt_s
     select
     local.tee $0
     i32.const 0
     local.get $0
     i32.const 0
     i32.le_s
     select
     i32.const 1
     i32.shl
     local.set $3
     local.get $0
     i32.const 0
     local.get $0
     i32.const 0
     i32.ge_s
     select
     i32.const 1
     i32.shl
     local.tee $0
     local.get $3
     i32.sub
     local.tee $2
     i32.eqz
     if
      global.get $~lib/memory/__stack_pointer
      i32.const 8
      i32.add
      global.set $~lib/memory/__stack_pointer
      i32.const 13920
      local.set $1
      br $folding-inner1
     end
     local.get $3
     i32.eqz
     local.get $0
     local.get $4
     i32.const 1
     i32.shl
     i32.eq
     i32.and
     if
      global.get $~lib/memory/__stack_pointer
      i32.const 8
      i32.add
      global.set $~lib/memory/__stack_pointer
      br $folding-inner1
     end
     global.get $~lib/memory/__stack_pointer
     local.get $2
     i32.const 2
     call $~lib/rt/itcms/__new
     local.tee $0
     i32.store offset=4
     local.get $0
     local.get $1
     local.get $3
     i32.add
     local.get $2
     memory.copy
     global.get $~lib/memory/__stack_pointer
     i32.const 8
     i32.add
     global.set $~lib/memory/__stack_pointer
     local.get $0
     local.set $1
     br $folding-inner1
    end
    global.get $~lib/memory/__stack_pointer
    i32.const 8
    i32.add
    global.set $~lib/memory/__stack_pointer
    local.get $1
    return
   end
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $1
 )
 (func $assembly/resonlang/Attractor#toString (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 36
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 24348
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.const 36
   memory.fill
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load offset=8
   local.tee $1
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   f64.load offset=16
   i32.const 4
   call $assembly/utils/toFixed
   local.tee $2
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.set $3
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load
   local.tee $4
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 6064
   i32.store offset=12
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 24348
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store
   local.get $4
   i32.load offset=4
   local.set $5
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store
   local.get $4
   i32.load offset=12
   local.set $4
   global.get $~lib/memory/__stack_pointer
   i32.const 6064
   i32.store
   local.get $5
   local.get $4
   call $~lib/util/string/joinIntegerArray<u32>
   local.set $4
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $3
   local.get $4
   i32.store offset=20
   global.get $~lib/memory/__stack_pointer
   local.set $3
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=28
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load offset=4
   local.tee $0
   i32.store offset=16
   global.get $~lib/memory/__stack_pointer
   i32.const 22608
   i32.store offset=24
   local.get $0
   i32.const 22608
   call $~lib/array/Array<f64>#map<~lib/string/String>
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 6064
   i32.store offset=12
   local.get $3
   local.get $0
   call $~lib/array/Array<~lib/string/String>#join
   local.tee $0
   i32.store offset=32
   global.get $~lib/memory/__stack_pointer
   i32.const 22544
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store offset=12
   i32.const 22548
   local.get $1
   i32.store
   i32.const 22544
   local.get $1
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 22544
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=12
   i32.const 22556
   local.get $2
   i32.store
   i32.const 22544
   local.get $2
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 22544
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store offset=12
   i32.const 22564
   local.get $4
   i32.store
   i32.const 22544
   local.get $4
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 22544
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=12
   i32.const 22572
   local.get $0
   i32.store
   i32.const 22544
   local.get $0
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 22544
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 13920
   i32.store offset=12
   i32.const 22544
   call $~lib/staticarray/StaticArray<~lib/string/String>#join
   local.set $0
   global.get $~lib/memory/__stack_pointer
   i32.const 36
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $0
   return
  end
  i32.const 57136
  i32.const 57184
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $assembly/index/runResoLangExample
  (local $0 i32)
  (local $1 f64)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 124
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner1
   global.get $~lib/memory/__stack_pointer
   i32.const 24348
   i32.lt_s
   br_if $folding-inner1
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.const 124
   memory.fill
   global.get $~lib/memory/__stack_pointer
   i32.const 1056
   i32.store
   i32.const 1056
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 1216
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 1216
   call $assembly/resonlang/ResonantFragment.encode
   local.tee $5
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   i32.const 15616
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $5
   i32.store offset=16
   local.get $5
   call $assembly/resonlang/ResonantFragment#toString
   local.set $2
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=12
   i32.const 15616
   local.get $2
   call $~lib/string/String#concat
   local.set $2
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store
   local.get $2
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 13
   i32.const 31
   i32.const 89
   call $assembly/resonlang/EntangledNode.generateNode
   local.tee $2
   i32.store offset=20
   global.get $~lib/memory/__stack_pointer
   i32.const 16144
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=16
   local.get $2
   call $assembly/resonlang/EntangledNode#toString
   local.set $3
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store offset=12
   i32.const 16144
   local.get $3
   call $~lib/string/String#concat
   local.set $3
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store
   local.get $3
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 16208
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 16208
   call $assembly/resonlang/ResonantFragment.encode
   local.tee $6
   i32.store offset=24
   global.get $~lib/memory/__stack_pointer
   i32.const 16256
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store offset=16
   local.get $6
   call $assembly/resonlang/ResonantFragment#toString
   local.set $3
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store offset=12
   i32.const 16256
   local.get $3
   call $~lib/string/String#concat
   local.set $3
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store
   local.get $3
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 23
   i32.const 41
   i32.const 71
   call $assembly/resonlang/EntangledNode.generateNode
   local.tee $3
   i32.store offset=28
   global.get $~lib/memory/__stack_pointer
   i32.const 16320
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store offset=16
   local.get $3
   call $assembly/resonlang/EntangledNode#toString
   local.set $4
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store offset=12
   i32.const 16320
   local.get $4
   call $~lib/string/String#concat
   local.set $4
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store
   local.get $4
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 5
   i32.const 17
   i32.const 97
   call $assembly/resonlang/EntangledNode.generateNode
   local.tee $4
   i32.store offset=32
   global.get $~lib/memory/__stack_pointer
   i32.const 16384
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store offset=16
   local.get $4
   call $assembly/resonlang/EntangledNode#toString
   local.set $7
   global.get $~lib/memory/__stack_pointer
   local.get $7
   i32.store offset=12
   i32.const 16384
   local.get $7
   call $~lib/string/String#concat
   local.set $7
   global.get $~lib/memory/__stack_pointer
   local.get $7
   i32.store
   local.get $7
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 11
   i32.const 29
   i32.const 83
   call $assembly/resonlang/EntangledNode.generateNode
   local.tee $7
   i32.store offset=36
   global.get $~lib/memory/__stack_pointer
   i32.const 16448
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $7
   i32.store offset=16
   local.get $7
   call $assembly/resonlang/EntangledNode#toString
   local.set $8
   global.get $~lib/memory/__stack_pointer
   local.get $8
   i32.store offset=12
   i32.const 16448
   local.get $8
   call $~lib/string/String#concat
   local.set $8
   global.get $~lib/memory/__stack_pointer
   local.get $8
   i32.store
   local.get $8
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store
   local.get $2
   global.set $assembly/resonlang/currentNode
   global.get $~lib/memory/__stack_pointer
   i32.const 16704
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/resonlang/currentNode
   local.tee $8
   i32.store offset=40
   local.get $8
   i32.eqz
   if
    i32.const 16512
    i32.const 16640
    i32.const 55
    i32.const 41
    call $~lib/builtins/abort
    unreachable
   end
   global.get $~lib/memory/__stack_pointer
   local.get $8
   i32.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $8
   i32.load
   local.tee $8
   i32.store offset=12
   i32.const 16704
   local.get $8
   call $~lib/string/String#concat
   local.set $8
   global.get $~lib/memory/__stack_pointer
   local.get $8
   i32.store
   local.get $8
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   local.get $5
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $5
   local.get $6
   call $assembly/operators/tensor
   local.tee $6
   i32.store offset=44
   global.get $~lib/memory/__stack_pointer
   i32.const 16768
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store offset=16
   local.get $6
   call $assembly/resonlang/ResonantFragment#toString
   local.set $8
   global.get $~lib/memory/__stack_pointer
   local.get $8
   i32.store offset=12
   i32.const 16768
   local.get $8
   call $~lib/string/String#concat
   local.set $8
   global.get $~lib/memory/__stack_pointer
   local.get $8
   i32.store
   local.get $8
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $6
   call $assembly/operators/collapse
   local.tee $6
   i32.store offset=48
   global.get $~lib/memory/__stack_pointer
   i32.const 16864
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store offset=16
   local.get $6
   call $assembly/resonlang/ResonantFragment#toString
   local.set $6
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store offset=12
   i32.const 16864
   local.get $6
   call $~lib/string/String#concat
   local.set $6
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store
   local.get $6
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 16976
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=16
   local.get $2
   call $assembly/resonlang/EntangledNode#toString
   local.set $6
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store offset=12
   i32.const 16976
   local.get $6
   call $~lib/string/String#concat
   local.set $6
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store
   local.get $6
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 24348
   i32.lt_s
   br_if $folding-inner1
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.store offset=8
   loop $for-loop|0
    global.get $~lib/memory/__stack_pointer
    local.get $2
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $2
    i32.load offset=8
    local.tee $6
    i32.store
    local.get $6
    call $~lib/array/Array<f64>#get:length
    local.get $0
    i32.gt_s
    if
     global.get $~lib/memory/__stack_pointer
     local.get $2
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $2
     i32.load offset=8
     local.tee $6
     i32.store
     global.get $~lib/memory/__stack_pointer
     local.get $2
     i32.store offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $2
     i32.load offset=8
     local.tee $8
     i32.store offset=4
     local.get $6
     local.get $0
     local.get $8
     local.get $0
     call $~lib/array/Array<f64>#__get
     f64.const 1.0471975511965976
     f64.add
     f64.const 6.283185307179586
     call $~lib/math/NativeMath.mod
     call $~lib/array/Array<f64>#__set
     global.get $~lib/memory/__stack_pointer
     local.get $2
     i32.store offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $2
     i32.load offset=8
     local.tee $6
     i32.store
     local.get $6
     local.get $0
     call $~lib/array/Array<f64>#__get
     f64.const 0
     f64.lt
     if
      global.get $~lib/memory/__stack_pointer
      local.get $2
      i32.store offset=4
      global.get $~lib/memory/__stack_pointer
      local.get $2
      i32.load offset=8
      local.tee $6
      i32.store
      global.get $~lib/memory/__stack_pointer
      local.get $2
      i32.store offset=8
      global.get $~lib/memory/__stack_pointer
      local.get $2
      i32.load offset=8
      local.tee $8
      i32.store offset=4
      local.get $6
      local.get $0
      local.get $8
      local.get $0
      call $~lib/array/Array<f64>#__get
      f64.const 6.283185307179586
      f64.add
      call $~lib/array/Array<f64>#__set
     end
     local.get $0
     i32.const 1
     i32.add
     local.set $0
     br $for-loop|0
    end
   end
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=4
   local.get $2
   local.get $2
   f64.load offset=16
   f64.const -0.016666666666666666
   f64.add
   f64.const 0
   f64.max
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 17072
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=16
   local.get $2
   call $assembly/resonlang/EntangledNode#toString
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=12
   i32.const 17072
   local.get $0
   call $~lib/string/String#concat
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store
   local.get $2
   f64.const 0.9
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store
   local.get $3
   f64.const 0.88
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $2
   f64.load offset=16
   i32.const 4
   call $assembly/utils/toFixed
   local.tee $0
   i32.store offset=52
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $3
   f64.load offset=16
   i32.const 4
   call $assembly/utils/toFixed
   local.tee $6
   i32.store offset=56
   global.get $~lib/memory/__stack_pointer
   i32.const 17392
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=12
   i32.const 17396
   local.get $0
   i32.store
   i32.const 17392
   local.get $0
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 17392
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $6
   i32.store offset=12
   i32.const 17404
   local.get $6
   i32.store
   i32.const 17392
   local.get $6
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 17392
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   i32.const 13920
   i32.store offset=12
   i32.const 17392
   call $~lib/staticarray/StaticArray<~lib/string/String>#join
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store offset=8
   local.get $2
   local.get $3
   call $assembly/operators/linkEntanglement
   global.get $~lib/memory/__stack_pointer
   i32.const 17888
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=16
   local.get $2
   call $assembly/resonlang/EntangledNode#toString
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=12
   i32.const 17888
   local.get $0
   call $~lib/string/String#concat
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 17984
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store offset=16
   local.get $3
   call $assembly/resonlang/EntangledNode#toString
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=12
   i32.const 17984
   local.get $0
   call $~lib/string/String#concat
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   i32.const 2
   i32.const 2
   i32.const 15
   call $~lib/rt/__newArray
   local.tee $0
   i32.store offset=60
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.load offset=4
   i32.store offset=64
   local.get $0
   i32.const 0
   local.get $3
   call $~lib/array/Array<assembly/resonlang/EntangledNode>#__set
   local.get $0
   i32.const 1
   local.get $7
   call $~lib/array/Array<assembly/resonlang/EntangledNode>#__set
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=12
   local.get $2
   local.get $4
   local.get $0
   call $assembly/operators/route
   local.set $0
   global.get $~lib/memory/__stack_pointer
   i32.const 19184
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   i32.const 19104
   i32.const 19152
   local.get $0
   select
   local.tee $0
   i32.store offset=12
   i32.const 19184
   local.get $0
   call $~lib/string/String#concat
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 19296
   i32.store
   i32.const 19296
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.load offset=8
   local.tee $0
   i32.store
   local.get $0
   f64.const 0.01
   call $~lib/array/Array<f64>#push
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.load offset=8
   local.tee $0
   i32.store
   local.get $0
   f64.const 0.02
   call $~lib/array/Array<f64>#push
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store
   local.get $2
   call $assembly/functionalBlocks/stabilize
   local.set $0
   global.get $~lib/memory/__stack_pointer
   i32.const 20000
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   i32.const 19936
   i32.const 19968
   local.get $0
   select
   local.tee $0
   i32.store offset=12
   i32.const 20000
   local.get $0
   call $~lib/string/String#concat
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   call $~lib/console/console.log
   global.get $assembly/resonlang/currentNode
   if
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/resonlang/currentNode
    local.tee $0
    i32.store offset=68
    local.get $0
    i32.eqz
    if
     i32.const 16512
     i32.const 16640
     i32.const 104
     i32.const 7
     call $~lib/builtins/abort
     unreachable
    end
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
    local.get $0
    f64.const 0.95
    f64.store offset=16
   end
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store
   local.get $4
   f64.const 0.92
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $5
   i32.store
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store offset=8
   local.get $5
   local.get $4
   call $assembly/functionalBlocks/teleport
   local.set $0
   global.get $~lib/memory/__stack_pointer
   i32.const 20976
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   i32.const 19936
   i32.const 19968
   local.get $0
   select
   local.tee $0
   i32.store offset=12
   i32.const 20976
   local.get $0
   call $~lib/string/String#concat
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 21056
   i32.store
   i32.const 21056
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.load offset=8
   local.tee $0
   i32.store
   local.get $0
   call $assembly/utils/entropyRate
   local.set $1
   global.get $~lib/memory/__stack_pointer
   i32.const 21136
   i32.store offset=8
   local.get $1
   i32.const 4
   call $assembly/utils/toFixed
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=12
   i32.const 21136
   local.get $0
   call $~lib/string/String#concat
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   call $~lib/console/console.log
   local.get $1
   f64.const -0.03
   f64.lt
   if
    global.get $~lib/memory/__stack_pointer
    i32.const 21232
    i32.store
    i32.const 21232
    call $~lib/console/console.log
    global.get $~lib/memory/__stack_pointer
    local.get $2
    i32.store
    local.get $2
    call $assembly/functionalBlocks/stabilize
    drop
   else
    global.get $~lib/memory/__stack_pointer
    i32.const 21440
    i32.store
    i32.const 21440
    call $~lib/console/console.log
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 21600
   i32.store
   i32.const 21600
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   local.get $5
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $5
   call $assembly/operators/entropy
   i32.const 4
   call $assembly/utils/toFixed
   local.tee $0
   i32.store offset=72
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/resonlang/currentNode
   if (result f64)
    global.get $~lib/memory/__stack_pointer
    global.get $assembly/resonlang/currentNode
    local.tee $2
    i32.store offset=76
    local.get $2
    i32.eqz
    if
     i32.const 16512
     i32.const 16640
     i32.const 128
     i32.const 153
     call $~lib/builtins/abort
     unreachable
    end
    global.get $~lib/memory/__stack_pointer
    local.get $2
    i32.store offset=8
    local.get $2
    call $assembly/operators/coherence
   else
    f64.const 0
   end
   call $~lib/number/F64#toString
   local.tee $2
   i32.store offset=80
   global.get $~lib/memory/__stack_pointer
   i32.const 21920
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=12
   i32.const 21924
   local.get $0
   i32.store
   i32.const 21920
   local.get $0
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 21920
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=12
   i32.const 21932
   local.get $2
   i32.store
   i32.const 21920
   local.get $2
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 21920
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   i32.const 13920
   i32.store offset=12
   i32.const 21920
   call $~lib/staticarray/StaticArray<~lib/string/String>#join
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   local.get $5
   i32.store
   local.get $5
   f64.const 0.05
   f64.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $5
   i32.store
   local.get $5
   call $assembly/operators/entropy
   f64.const 0.1
   f64.lt
   if (result i32)
    global.get $assembly/resonlang/currentNode
    if (result i32)
     global.get $~lib/memory/__stack_pointer
     global.get $assembly/resonlang/currentNode
     local.tee $0
     i32.store offset=84
     local.get $0
     i32.eqz
     if
      i32.const 16512
      i32.const 16640
      i32.const 131
      i32.const 59
      call $~lib/builtins/abort
      unreachable
     end
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store
     local.get $0
     call $assembly/operators/coherence
     f64.const 0.92
     f64.gt
    else
     i32.const 0
    end
   else
    i32.const 0
   end
   if
    global.get $~lib/memory/__stack_pointer
    local.get $5
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $5
    call $assembly/operators/collapse
    local.tee $0
    i32.store offset=88
    global.get $~lib/memory/__stack_pointer
    i32.const 21968
    i32.store offset=8
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=16
    local.get $0
    call $assembly/resonlang/ResonantFragment#toString
    local.set $0
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=12
    i32.const 21968
    local.get $0
    call $~lib/string/String#concat
    local.set $0
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
   else
    i32.const 22064
    local.set $0
    global.get $~lib/memory/__stack_pointer
    i32.const 22064
    i32.store
   end
   local.get $0
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 22176
   i32.store
   i32.const 22176
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 22272
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 22272
   f64.const 0.98
   call $assembly/resonlang/Attractor.create
   local.tee $0
   i32.store offset=92
   global.get $~lib/memory/__stack_pointer
   i32.const 22640
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=16
   local.get $0
   call $assembly/resonlang/Attractor#toString
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=12
   i32.const 22640
   local.get $0
   call $~lib/string/String#concat
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 22720
   i32.store
   i32.const 22720
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 24
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 24348
   i32.lt_s
   br_if $folding-inner1
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.const 24
   memory.fill
   global.get $~lib/memory/__stack_pointer
   i32.const 22800
   i32.store offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store offset=12
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.load
   local.tee $2
   i32.store offset=8
   i32.const 22800
   local.get $2
   call $~lib/string/String#concat
   local.set $2
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store
   local.get $2
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store
   local.get $3
   f64.load offset=16
   f64.const 0.7
   f64.gt
   if (result i32)
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.store
    local.get $3
    i32.load offset=8
   else
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.load
    local.tee $2
    i32.store offset=16
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $3
    f64.load offset=16
    i32.const 4
    call $assembly/utils/toFixed
    local.tee $3
    i32.store offset=20
    global.get $~lib/memory/__stack_pointer
    i32.const 23088
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $2
    i32.store offset=8
    i32.const 23092
    local.get $2
    i32.store
    i32.const 23088
    local.get $2
    i32.const 1
    call $~lib/rt/itcms/__link
    global.get $~lib/memory/__stack_pointer
    i32.const 23088
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.store offset=8
    i32.const 23100
    local.get $3
    i32.store
    i32.const 23088
    local.get $3
    i32.const 1
    call $~lib/rt/itcms/__link
    global.get $~lib/memory/__stack_pointer
    i32.const 23088
    i32.store offset=4
    global.get $~lib/memory/__stack_pointer
    i32.const 13920
    i32.store offset=8
    i32.const 23088
    call $~lib/staticarray/StaticArray<~lib/string/String>#join
    local.set $2
    global.get $~lib/memory/__stack_pointer
    local.get $2
    i32.store
    local.get $2
    call $~lib/console/console.log
    call $~lib/array/Array<f64>#constructor
   end
   local.set $2
   global.get $~lib/memory/__stack_pointer
   i32.const 24
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $0
   local.get $2
   i32.store offset=96
   global.get $~lib/memory/__stack_pointer
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=16
   global.get $~lib/memory/__stack_pointer
   i32.const 23248
   i32.store offset=100
   local.get $2
   i32.const 23248
   call $~lib/array/Array<f64>#map<~lib/string/String>
   local.set $2
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   i32.const 6064
   i32.store offset=12
   local.get $0
   local.get $2
   call $~lib/array/Array<~lib/string/String>#join
   local.tee $0
   i32.store offset=104
   global.get $~lib/memory/__stack_pointer
   i32.const 23216
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=12
   i32.const 23220
   local.get $0
   i32.store
   i32.const 23216
   local.get $0
   i32.const 1
   call $~lib/rt/itcms/__link
   global.get $~lib/memory/__stack_pointer
   i32.const 23216
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   i32.const 13920
   i32.store offset=12
   i32.const 23216
   call $~lib/staticarray/StaticArray<~lib/string/String>#join
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 23280
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 23280
   f64.const 1
   call $assembly/resonlang/Attractor.create
   local.tee $0
   i32.store offset=108
   global.get $~lib/memory/__stack_pointer
   i32.const 23312
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=16
   local.get $0
   call $assembly/resonlang/Attractor#toString
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=12
   i32.const 23312
   local.get $0
   call $~lib/string/String#concat
   local.set $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 23392
   i32.store
   i32.const 23392
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 29
   i32.const 67
   i32.const 113
   call $assembly/resonlang/EntangledNode.generateNode
   local.tee $0
   i32.store offset=112
   global.get $~lib/memory/__stack_pointer
   i32.const 23504
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=16
   local.get $0
   call $assembly/resonlang/EntangledNode#toString
   local.set $2
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=12
   i32.const 23504
   local.get $2
   call $~lib/string/String#concat
   local.set $2
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store
   local.get $2
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 23568
   i32.store
   global.get $~lib/memory/__stack_pointer
   i32.const 23568
   call $assembly/resonlang/ResonantFragment.encode
   local.tee $2
   i32.store offset=116
   global.get $~lib/memory/__stack_pointer
   i32.const 23648
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $2
   i32.store offset=16
   local.get $2
   call $assembly/resonlang/ResonantFragment#toString
   local.set $3
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store offset=12
   i32.const 23648
   local.get $3
   call $~lib/string/String#concat
   local.set $3
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store
   local.get $3
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   global.set $assembly/resonlang/currentNode
   global.get $~lib/memory/__stack_pointer
   i32.const 23712
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/resonlang/currentNode
   local.tee $3
   i32.store offset=120
   local.get $3
   i32.eqz
   if
    i32.const 16512
    i32.const 16640
    i32.const 168
    i32.const 39
    call $~lib/builtins/abort
    unreachable
   end
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.load
   local.tee $3
   i32.store offset=12
   i32.const 23712
   local.get $3
   call $~lib/string/String#concat
   local.set $3
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store
   local.get $3
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 23776
   i32.store offset=8
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store offset=16
   local.get $0
   call $assembly/operators/coherence
   i32.const 4
   call $assembly/utils/toFixed
   local.set $3
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store offset=12
   i32.const 23776
   local.get $3
   call $~lib/string/String#concat
   local.set $3
   global.get $~lib/memory/__stack_pointer
   local.get $3
   i32.store
   local.get $3
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   f64.const 0.95
   f64.store offset=16
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store
   local.get $0
   call $assembly/operators/coherence
   f64.const 0.9
   f64.gt
   if
    global.get $~lib/memory/__stack_pointer
    local.get $2
    i32.store
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store offset=8
    local.get $2
    local.get $0
    call $assembly/functionalBlocks/teleport
    local.set $0
    global.get $~lib/memory/__stack_pointer
    i32.const 23952
    i32.store offset=8
    global.get $~lib/memory/__stack_pointer
    i32.const 19936
    i32.const 19968
    local.get $0
    select
    local.tee $0
    i32.store offset=12
    i32.const 23952
    local.get $0
    call $~lib/string/String#concat
    local.set $0
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store
   else
    i32.const 24064
    local.set $0
    global.get $~lib/memory/__stack_pointer
    i32.const 24064
    i32.store
   end
   local.get $0
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 24176
   i32.store
   i32.const 24176
   call $~lib/console/console.log
   global.get $~lib/memory/__stack_pointer
   i32.const 124
   i32.add
   global.set $~lib/memory/__stack_pointer
   return
  end
  i32.const 57136
  i32.const 57184
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $~lib/arraybuffer/ArrayBuffer#constructor (param $0 i32) (result i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  local.get $0
  i32.const 1073741820
  i32.gt_u
  if
   i32.const 1664
   i32.const 1712
   i32.const 52
   i32.const 43
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.const 1
  call $~lib/rt/itcms/__new
  local.tee $0
  i32.store
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $~lib/rt/__newArray (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/memory/__stack_pointer
  local.get $0
  local.get $1
  i32.shl
  local.tee $1
  i32.const 1
  call $~lib/rt/itcms/__new
  local.tee $3
  i32.store
  i32.const 16
  local.get $2
  call $~lib/rt/itcms/__new
  local.tee $2
  local.get $3
  i32.store
  local.get $2
  local.get $3
  i32.const 0
  call $~lib/rt/itcms/__link
  local.get $2
  local.get $3
  i32.store offset=4
  local.get $2
  local.get $1
  i32.store offset=8
  local.get $2
  local.get $0
  i32.store offset=12
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $2
 )
 (func $~lib/util/number/utoa32 (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 24348
  i32.lt_s
  if
   i32.const 57136
   i32.const 57184
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  local.get $0
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   i32.const 13952
   return
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.const 100000
  i32.lt_u
  if (result i32)
   local.get $0
   i32.const 100
   i32.lt_u
   if (result i32)
    local.get $0
    i32.const 10
    i32.ge_u
    i32.const 1
    i32.add
   else
    local.get $0
    i32.const 10000
    i32.ge_u
    i32.const 3
    i32.add
    local.get $0
    i32.const 1000
    i32.ge_u
    i32.add
   end
  else
   local.get $0
   i32.const 10000000
   i32.lt_u
   if (result i32)
    local.get $0
    i32.const 1000000
    i32.ge_u
    i32.const 6
    i32.add
   else
    local.get $0
    i32.const 1000000000
    i32.ge_u
    i32.const 8
    i32.add
    local.get $0
    i32.const 100000000
    i32.ge_u
    i32.add
   end
  end
  local.tee $2
  i32.const 1
  i32.shl
  i32.const 2
  call $~lib/rt/itcms/__new
  local.tee $1
  i32.store
  local.get $1
  local.get $0
  local.get $2
  call $~lib/util/number/utoa32_dec_lut
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $1
 )
)
