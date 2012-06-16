nawk -F" " 'FNR==NR{f2[$2]=$5;next} $2+0 in f2 {$6=f2[$2+0]}1' OFS=" " $1 $2 > new_file_$(date +%b%d_%Y_%k:%M:%S)_$$.txt
