package a;

import b.a;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.util.ArrayList;

public final class b
{
  private ArrayList a = new ArrayList();
  private String[][] b = null;
  private Integer[][] c = null;
  private int d = 0;
  private int[] e = null;

  public b(ArrayList paramArrayList)
  {
    this.a = paramArrayList;
  }

  public final void a()
  {
    try
    {
      BufferedReader localBufferedReader = new BufferedReader(new InputStreamReader(new FileInputStream(a.x)));
      Object localObject1 = null;
      int k = 0;
      int m = 0;
      Object localObject2;
      while ((localObject2 = localBufferedReader.readLine()) != null)
      {
        if (localObject1.trim().isEmpty())
          continue;
        if (m == 0)
        {
          String[] arrayOfString = localObject1.split(",");
          i1 = 0;
          for (int i = 0; i < arrayOfString.length; i++)
            i1++;
          this.d = i1;
          n = 1;
        }
        k++;
      }
      this.b = new String[this.d][k];
      this.c = new Integer[this.d][k];
      localBufferedReader.close();
      System.out.println("\tFirst round finished!");
      localBufferedReader = new BufferedReader(new InputStreamReader(new FileInputStream(a.x)));
      this.e = new int[this.d];
      int n = 1;
      int i1 = 0;
      while ((localObject2 = localBufferedReader.readLine()) != null)
      {
        i1++;
        if (i1 % 100 == 0)
          System.out.println("\t\tline: " + i1 + " finished!");
        if (((String)localObject2).trim().isEmpty())
          continue;
        localObject2 = ((String)localObject2).split(",");
        for (k = 0; (k < localObject2.length) && (k < this.d); k++)
        {
          if (localObject2[k].trim().isEmpty())
            continue;
          String str = localObject2[k].trim();
          if (this.a.contains(str))
          {
            this.b[k][this.e[k]] = str;
            this.e[k] += 1;
          }
          else
          {
            System.out.println(str + " doesn't appeare in arff source file!\n");
            n = 0;
          }
        }
      }
      if (n == 0)
      {
        System.out.println("SNP check for list file failed!");
        System.exit(a.e);
      }
      localBufferedReader.close();
      System.out.println("\tSecond round finished!");
      for (int j = 0; j < this.d; j++)
        for (k = 0; k < this.e[j]; k++)
          this.c[j][k] = Integer.valueOf(this.a.indexOf(this.b[j][k]));
      System.out.println("\tAll finished!");
      return;
    }
    catch (IOException localIOException)
    {
      System.out.println("IOException in start from ProcessListFileWithMultiColumns.java");
      System.exit(a.e);
    }
  }

  public final Integer[][] b()
  {
    return this.c;
  }

  public final int c()
  {
    return this.d;
  }

  public final int[] d()
  {
    return this.e;
  }
}

/* Location:           C:\Downloads\Project\MyEclipse\pipeline.jar
 * Qualified Name:     a.b
 * JD-Core Version:    0.6.0
 */