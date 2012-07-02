package b;

import java.io.PrintStream;

public final class c
{
  private static String a = "1. --help. this parameter means you want to know how to use our jar file. If you use this parameter, all the others will be ignored.";
  private static String b = "2. --fast(only applied to raw file). this parameter means you want a simple way to convert .raw to .arff. In this way, it will be very fast especially you're processing a very large file. However, it will only do the following changes:\n\t2.1 replace \"NA\" to \"?\"\n\t2.2 replace \" \" to \",\", like a csv file\n\t2.3 generate the @attribute part(only all the SNPs, SEX and PHENOTYPE), but the value are all {0, 1, 2}\n\t2.4 generate the @relation part based on parameter\n\t2.5 generate the @data part.\nIf you use this parameter and not use --help, --src, --des and --name are needed and necessary. --cov and --list will be ignored --fast can add an extra parameter to specify the \"block size\" for mapped buffered byte. If you don't specify it or the value is improper(above 500MB or less than 5MB), the default value is 30Mb.";
  private static String c = "3. --srcR/--srcA(necessary forever). this parameter means the .raw/.arff file path.";
  private static String d = "4. --des(necessary forever). this parameter means the .arff file path. If file existed, the program will ask whether to overwrite it; if the file didn't exist but the directory existed, it will automatically create new file; if neither the file or directory existed, it will give the error. In the mean time, when the program doesn't use the fast method(--fast), it will also create a file with same name as --des specified but end with .temp, which is the temp file only record all the instances with the necessary SNPs .list file requires.";
  private static String e = "5. --name(necessary for raw file). this parameter gives the relation name for the .arff file. The name can be separated by blank.";
  private static String f = "6. --list(necessary for arff file). this parameter gives the .list file path. The names of the SNPs in this file don't need to be the same order as .raw file.";
  private static String g = "7. --test. replace all the{0, 1}, {0, 2} and {1, 2} in SNPs with {0, 1, 2}";

  public static void a()
  {
    System.out.println("help:\n");
    System.out.println(a);
    System.out.println(b);
    System.out.println(c);
    System.out.println(d);
    System.out.println(e);
    System.out.println(f);
    System.out.println(g);
  }
}

/* Location:           C:\Downloads\Project\MyEclipse\pipeline.jar
 * Qualified Name:     b.c
 * JD-Core Version:    0.6.0
 */