nawk -F" " 'FNR==NR{f2[$2]=$5;next} $2+0 in f2 {$6=f2[$2+0]}1' OFS=" " phs000168.v1.pht000707.v1.p1.c1.LOAD610K_Phenotypes.GRU.txt LOAD-610K_FORWARD_strand_consent_1.fam > new_file_$(date +%b%d_%Y_%k:%M:%S)_$$.txt
