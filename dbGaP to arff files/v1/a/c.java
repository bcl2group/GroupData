package a;

import b.a;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.util.ArrayList;

public final class c
{
  private ArrayList a = null;
  private ArrayList b = new ArrayList();
  private ArrayList c = new ArrayList();
  private ArrayList d = new ArrayList();
  private String e;

  public c(ArrayList paramArrayList1, ArrayList paramArrayList2)
  {
    this.b = paramArrayList2;
    this.a = paramArrayList1;
    this.e = a.x;
  }

  public final void a()
  {
    c localc = this;
    int i = 0;
    try
    {
      BufferedReader localBufferedReader = new BufferedReader(new InputStreamReader(new FileInputStream(localc.e)));
      String str1 = null;
      while ((str1 = localBufferedReader.readLine()) != null)
      {
        if (i % 10000 == 0)
        {
          long l = Runtime.getRuntime().totalMemory();
          System.out.printf("SNP search No. %d, Memory Usage: %d Mb, Total SNPs: %d\n", new Object[] { Integer.valueOf(i), Long.valueOf(l / a.a), Integer.valueOf(localc.b.size()) });
        }
        String str2 = str1.trim();
        if (!localc.a.contains(str2))
        {
          System.out.println("snp " + str2 + " doesn't appear in .raw file!");
        }
        else
        {
          localc.c.add((Integer)localc.b.get(localc.a.indexOf(str2)));
          localc.d.add(str2);
        }
        i++;
      }
      localBufferedReader.close();
    }
    catch (IOException localIOException)
    {
      System.out.println("IOException in getSNPsFromListFile from RawToArff.java");
      System.exit(a.e);
    }
    if (localc.c.size() == 0)
    {
      System.out.println("No snp match!");
      System.exit(a.e);
    }
  }

  public final ArrayList b()
  {
    return this.d;
  }

  public final ArrayList c()
  {
    return this.c;
  }
}

/* Location:           C:\Downloads\Project\MyEclipse\pipeline.jar
 * Qualified Name:     a.c
 * JD-Core Version:    0.6.0
 */