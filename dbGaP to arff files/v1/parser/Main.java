package parser;

import a.d;
import a.e;
import b.c;
import java.io.PrintStream;

public class Main
{
  public static void main(String[] paramArrayOfString)
  {
    paramArrayOfString = paramArrayOfString;
    StringBuffer localStringBuffer = new StringBuffer();
    for (int i = 0; i < paramArrayOfString.length; i++)
    {
      localStringBuffer.append(paramArrayOfString[i]);
      localStringBuffer.append(' ');
    }
    if (localStringBuffer.toString().trim().toLowerCase().contains("--help"))
    {
      c.a();
      return;
    }
    String[] arrayOfString = localStringBuffer.toString().trim().split("--");
    System.out.println("Your command is intented to do with following parameters:");
    if (((paramArrayOfString = localStringBuffer.toString().trim().toLowerCase()).contains("--srcr")) && (paramArrayOfString.contains("--srca")))
    {
      System.out.println("you can only specify one type of source file");
    }
    else
    {
      long l1;
      long l2;
      if (paramArrayOfString.contains("--srcr"))
      {
        if ((paramArrayOfString = a.a.a(arrayOfString)) == b.a.m)
        {
          System.out.println("******************************************");
          System.out.println("**start processing data with fast method**");
          System.out.println("******************************************");
          paramArrayOfString = new e();
          l1 = System.currentTimeMillis();
          paramArrayOfString.a();
          l2 = System.currentTimeMillis();
          System.out.println("sum time: " + (l2 - l1) / 1000L + " s");
          return;
        }
        if (paramArrayOfString == b.a.n)
        {
          System.out.println("******************************************");
          System.out.println("***start processing data with raw method**");
          System.out.println("******************************************");
          paramArrayOfString = new d();
          l1 = System.currentTimeMillis();
          paramArrayOfString.a();
          l2 = System.currentTimeMillis();
          System.out.println("total time: " + (l2 - l1) / 1000L + " s");
          return;
        }
        System.exit(b.a.g);
        return;
      }
      if (!paramArrayOfString.contains("--srca"))
        return;
      if ((paramArrayOfString = a.a.b(arrayOfString)) == b.a.o)
      {
        System.out.println("******************************************");
        System.out.println("**start processing data with arff method**");
        System.out.println("******************************************");
        paramArrayOfString = new a.a();
        l1 = System.currentTimeMillis();
        paramArrayOfString.a();
        l2 = System.currentTimeMillis();
        System.out.println("total time: " + (l2 - l1) / 1000L + " s");
        return;
      }
    }
    System.exit(b.a.g);
  }
}

/* Location:           C:\Downloads\Project\MyEclipse\pipeline.jar
 * Qualified Name:     parser.Main
 * JD-Core Version:    0.6.0
 */